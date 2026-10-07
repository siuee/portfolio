#!/usr/bin/env python3
"""
Build the hero loop + still images from the raw intro video.

    python3 scripts/build-hero-assets.py [path/to/intro.mp4] [--crop W:H:X:Y] [--level 0.92]

Pipeline: detect the person -> 4:5 crop -> scale 768x960 -> colorlevels whitening
(imax measured from the backdrop, capped at 0.98) -> take the first 10 s and
cross-fade the last 0.5 s into the first 0.5 s (xfade for picture, equal-power
numpy fade for audio; nothing is retimed, so lips stay in sync).

Outputs
    public/hero/hero.mp4     H.264 yuv420p, CRF 24, preset slow, AAC 96k, +faststart
    public/hero/hero.webm    VP9 CRF 36, Opus 80k
    public/hero/poster.webp  first frame of the loop (video poster)
    public/portrait-bust.webp  480x600 head-to-shirt crop of the sharpest frame
    public/og.jpg            1200x630 social card

Requirements: ffmpeg (on PATH, $FFMPEG, or the `imageio-ffmpeg` pip package),
numpy, Pillow.
"""
from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
OUT_W, OUT_H = 768, 960          # 4:5 hero frame
CLIP_SECONDS = 10.0              # how much of the intro to use
FADE = 0.5                       # seamless cross-fade length (seconds)
SR = 48000                       # audio sample rate

def find_ffmpeg() -> str:
    for cand in (os.environ.get("FFMPEG"), shutil.which("ffmpeg")):
        if cand:
            return cand
    try:
        import imageio_ffmpeg  # type: ignore

        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("ffmpeg not found. Install it, set $FFMPEG, or `pip install imageio-ffmpeg`.")


FF = find_ffmpeg()


def run(args: list[str], **kw) -> subprocess.CompletedProcess:
    return subprocess.run([FF, "-hide_banner", "-v", "error", "-y", *args], check=True, **kw)


def probe(src: Path) -> tuple[int, int, float]:
    out = subprocess.run([FF, "-hide_banner", "-i", str(src)], capture_output=True, text=True).stderr
    import re

    w, h = map(int, re.search(r"Video:.*?(\d{3,5})x(\d{3,5})", out).groups())
    fps = float(re.search(r"([\d.]+) fps", out).group(1))
    return w, h, fps


def read_frames(src: Path, w: int, h: int, fps: float, step: int = 6) -> np.ndarray:
    """Every `step`-th frame as an (N, h, w, 3) uint8 array."""
    raw = run(
        ["-i", str(src), "-t", str(CLIP_SECONDS), "-vf", f"select=not(mod(n\\,{step}))",
         "-vsync", "vfr", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        capture_output=True,
    ).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3)


def detect_person(frames: np.ndarray) -> tuple[int, int, int, int]:
    """Union bbox of 'not background' pixels across frames."""
    bg = np.median(frames[:, :8, :, :].reshape(-1, 3), axis=0)  # top rows are backdrop
    mask = np.zeros(frames.shape[1:3], bool)
    for f in frames:
        diff = np.abs(f.astype(np.int16) - bg).max(axis=2)
        mask |= diff > 38
    # ignore isolated speckles: require a few hits per row / column
    rows = np.where(mask.sum(axis=1) > 3)[0]
    cols = np.where(mask.sum(axis=0) > 3)[0]
    return cols.min(), rows.min(), cols.max(), rows.max()


def plan_crop(bbox, w: int, h: int) -> tuple[int, int, int, int]:
    x0, y0, x1, y1 = bbox
    ph = y1 - y0
    ch = min(h, int(ph * 1.14) & ~1)               # head-to-toe plus breathing room
    cw = min(w, int(ch * OUT_W / OUT_H) & ~1)
    cx = (x0 + x1) // 2
    cy = (y0 + y1) // 2
    x = int(np.clip(cx - cw // 2, 0, w - cw)) & ~1
    y = int(np.clip(cy - ch // 2 - ph * 0.01, 0, h - ch)) & ~1
    return cw, ch, x, y


def whiten_level(frames: np.ndarray, bbox) -> float:
    """Input level that maps the backdrop to pure white (never above 0.98)."""
    x0, y0, x1, y1 = bbox
    mask = np.ones(frames.shape[1:3], bool)
    mask[max(0, y0 - 10):y1 + 10, max(0, x0 - 10):x1 + 10] = False
    backdrop = frames[:, mask].min(axis=-1)
    return round(min(0.98, float(np.percentile(backdrop, 5)) / 255), 3)


def sharpest_frame(frames: np.ndarray) -> int:
    def lap_var(f: np.ndarray) -> float:
        g = f.mean(axis=2)
        lap = -4 * g[1:-1, 1:-1] + g[:-2, 1:-1] + g[2:, 1:-1] + g[1:-1, :-2] + g[1:-1, 2:]
        return float(lap.var())

    return int(np.argmax([lap_var(f) for f in frames]))


def build_audio(src: Path, tmp: Path) -> Path:
    """Sample-accurate equal-power cross-fade of the tail into the head."""
    raw = run(
        ["-i", str(src), "-t", str(CLIP_SECONDS), "-vn", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
        capture_output=True,
    ).stdout
    a = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)
    total = int(round(CLIP_SECONDS * SR))
    if len(a) < total:
        a = np.vstack([a, np.zeros((total - len(a), 2))])
    a = a[:total]
    n = int(round(FADE * SR))
    head, body = a[:n], a[n:].copy()                       # body = [FADE, CLIP)
    t = np.linspace(0.0, 1.0, n, endpoint=False)[:, None]
    fade_in, fade_out = np.sin(t * np.pi / 2), np.cos(t * np.pi / 2)
    body[-n:] = body[-n:] * fade_out + head * fade_in        # ends exactly where body begins
    body = np.clip(body, -1, 1)
    out = tmp / "loop.wav"
    with wave.open(str(out), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes((body * 32767).astype("<i2").tobytes())
    return out


def build_video(src: Path, crop: str, tmp: Path, fps: float, level: float) -> Path:
    body_len = CLIP_SECONDS - FADE
    whiten = f"colorlevels=rimax={level}:gimax={level}:bimax={level}"
    vf = f"crop={crop},scale={OUT_W}:{OUT_H}:flags=lanczos,{whiten},format=yuv420p,setsar=1"
    graph = (
        f"[0:v]{vf},split=2[a][b];"
        f"[a]trim=start={FADE}:end={CLIP_SECONDS},setpts=PTS-STARTPTS,fps={fps}[body];"
        f"[b]trim=start=0:end={FADE},setpts=PTS-STARTPTS,fps={fps}[head];"
        f"[body][head]xfade=transition=fade:duration={FADE}:offset={body_len - FADE}[v]"
    )
    out = tmp / "loop.mkv"
    run(["-i", str(src), "-filter_complex", graph, "-map", "[v]", "-c:v", "ffv1", str(out)])
    return out


def export(video: Path, audio: Path) -> None:
    hero = PUBLIC / "hero"
    hero.mkdir(parents=True, exist_ok=True)
    common = ["-i", str(video), "-i", str(audio), "-map", "0:v", "-map", "1:a", "-shortest"]
    run([*common, "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p",
         "-profile:v", "high", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart",
         str(hero / "hero.mp4")])
    run([*common, "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", "-deadline", "good",
         "-cpu-used", "2", "-pix_fmt", "yuv420p", "-c:a", "libopus", "-b:a", "80k", str(hero / "hero.webm")])
    # first frame of the loop, so the poster matches frame 0 exactly (fast LCP before the video arrives)
    from PIL import Image

    raw = run(["-i", str(hero / "hero.mp4"), "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
              capture_output=True).stdout
    Image.frombytes("RGB", (OUT_W, OUT_H), raw).save(hero / "poster.webp", "WEBP", quality=70, method=6)


def stills(frame: np.ndarray, bbox, level: float) -> None:
    from PIL import Image, ImageDraw, ImageFont

    arr = np.clip(frame.astype(np.float32) / level, 0, 255).astype(np.uint8)
    img = Image.fromarray(arr)
    x0, y0, x1, y1 = bbox
    ph = y1 - y0
    cx = (x0 + x1) / 2
    # head-to-shirt: from just above the hair to roughly the chest, 4:5
    bh = ph * 0.36
    bw = bh * 480 / 600
    top = y0 - ph * 0.03
    bust = img.crop((int(cx - bw / 2), int(top), int(cx + bw / 2), int(top + bh)))
    bust = bust.resize((480, 600), Image.LANCZOS)
    bust.save(PUBLIC / "portrait-bust.webp", "WEBP", quality=88, method=6)

    paper = (244, 242, 238)
    og = Image.new("RGB", (1200, 630), paper)
    body = img.crop((int(cx - ph * 0.42), int(y0 - ph * 0.04), int(cx + ph * 0.42), int(y1 + ph * 0.04)))
    body = body.resize((int(630 * body.width / body.height), 630), Image.LANCZOS)
    region = og.crop((1200 - body.width - 40, 0, 1200 - 40, 630))
    mult = (np.asarray(region, np.float32) * np.asarray(body, np.float32) / 255).astype(np.uint8)
    og.paste(Image.fromarray(mult), (1200 - body.width - 40, 0))

    d = ImageDraw.Draw(og)
    fonts = ROOT / "src" / "fonts"

    def font(name: str, size: int):
        try:
            return ImageFont.truetype(str(fonts / name), size)
        except OSError:
            return ImageFont.load_default(size)

    ink, mute = (13, 13, 13), (119, 117, 111)
    d.text((72, 92), "PORTFOLIO — 2026", font=font("JetBrainsMono-Variable.woff2", 22), fill=mute)
    sans = font("InterTight-Variable.woff2", 96)
    try:
        sans.set_variation_by_axes([780])
    except Exception:
        pass
    d.text((66, 200), "Sudip", font=sans, fill=ink)
    d.text((66, 296), "Koirala", font=sans, fill=ink)
    d.text((72, 430), "Full Stack Engineer", font=font("InstrumentSerif-Italic.woff2", 54), fill=mute)
    d.text((72, 512), "AI Developer · Security Developer", font=font("JetBrainsMono-Variable.woff2", 22), fill=mute)
    og.save(PUBLIC / "og.jpg", "JPEG", quality=86, optimize=True, progressive=True)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("src", nargs="?", default=str(Path.home() / "Downloads" / "intro.mp4"))
    ap.add_argument("--crop", help="override auto-detected crop, e.g. 800:1000:560:80")
    ap.add_argument("--level", type=float, help="override colorlevels imax (default: measured, max 0.98)")
    args = ap.parse_args()
    src = Path(args.src)
    if not src.exists():
        sys.exit(f"source video not found: {src}")

    w, h, fps = probe(src)
    frames = read_frames(src, w, h, fps)
    bbox = detect_person(frames)
    cw, ch, cx, cy = plan_crop(bbox, w, h)
    crop = args.crop or f"{cw}:{ch}:{cx}:{cy}"
    level = args.level or whiten_level(frames, bbox)
    print(f"source {w}x{h} @ {fps}fps · person bbox {tuple(map(int, bbox))} · crop={crop} · imax={level}")

    with tempfile.TemporaryDirectory() as t:
        tmp = Path(t)
        audio = build_audio(src, tmp)
        video = build_video(src, crop, tmp, fps, level)
        export(video, audio)

    stills(frames[sharpest_frame(frames)], bbox, level)
    for p in ("hero/hero.mp4", "hero/hero.webm", "hero/poster.webp", "portrait-bust.webp", "og.jpg"):
        print(f"  {p:22s} {(PUBLIC / p).stat().st_size / 1024:8.1f} kB")


if __name__ == "__main__":
    main()
