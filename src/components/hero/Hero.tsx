"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";

const UNLOCK_EVENTS = ["pointerdown", "keydown", "touchend"] as const;

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const visible = useRef(true);
  const userPaused = useRef(false);

  const play = useCallback(() => {
    const v = video.current;
    if (!v || !visible.current || userPaused.current) return;
    v.play().catch(() => {
      // unmuted playback refused: fall back to muted so the picture keeps moving
      if (!v.muted) {
        v.muted = true;
        setMuted(true);
        setBlocked(true);
        v.play().catch(() => {});
      }
    });
  }, []);

  // first load: try with sound, else muted + wait for a gesture
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    let removed = false;

    const unlock = (e: Event) => {
      cleanup();
      if (userPaused.current || controls.current?.contains(e.target as Node)) return;
      v.muted = false;
      setMuted(false);
      setBlocked(false);
      play();
    };
    const cleanup = () => {
      if (removed) return;
      removed = true;
      UNLOCK_EVENTS.forEach((ev) => window.removeEventListener(ev, unlock, true));
    };

    v.muted = false;
    v.play()
      .then(() => {
        setMuted(false);
        cleanup();
      })
      .catch(() => {
        v.muted = true;
        setMuted(true);
        setBlocked(true);
        v.play().catch(() => {});
        UNLOCK_EVENTS.forEach((ev) => window.addEventListener(ev, unlock, { capture: true, passive: true }));
      });

    return cleanup;
  }, [play]);

  // pause (and so silence) once less than 35 % of the hero is on screen
  useEffect(() => {
    const el = section.current;
    const v = video.current;
    if (!el || !v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.intersectionRatio >= 0.35;
        if (visible.current) play();
        else v.pause();
      },
      { threshold: [0, 0.35, 0.6, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [play]);

  const turnSoundOn = () => {
    const v = video.current;
    if (!v) return;
    v.muted = false;
    userPaused.current = false;
    setMuted(false);
    setPaused(false);
    setBlocked(false);
    play();
  };

  const toggleMute = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const togglePlay = () => {
    const v = video.current;
    if (!v) return;
    if (paused) {
      userPaused.current = false;
      setPaused(false);
      play();
    } else {
      v.pause();
      userPaused.current = true;
      setPaused(true);
    }
  };

  return (
    <section ref={section} id="top" className="hero" aria-labelledby="hero-title" tabIndex={-1}>
      <p className="hero-ghost" aria-hidden="true">
        {PROFILE.firstName.toUpperCase()}
      </p>

      <div className="hero-stage">
        <video
          ref={video}
          className="hero-video"
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero/poster.webp"
          aria-label={`Video: ${PROFILE.name} introducing himself`}
          width={768}
          height={960}
        >
          <source src="/hero/hero.webm" type="video/webm" />
          <source src="/hero/hero.mp4" type="video/mp4" />
        </video>
        <p className="sr-only">
          A short looping intro video of {PROFILE.name}, standing and speaking to the camera.
        </p>
      </div>

      <div className="hero-copy wrap">
        <div className="hero-left">
          <p className="tag rv">
            <b>{PROFILE.name}</b>
            <span aria-hidden="true">—</span>
            {PROFILE.location}
          </p>
          <h1 id="hero-title" className="hero-title">
            <span className="sr-only">{PROFILE.name}, </span>
            <span className="rv-mask">
              <span>Full Stack</span>
            </span>
            <span className="rv-mask" style={{ "--i": 1 } as React.CSSProperties}>
              <span>
                <em className="accent">Engineer.</em>
              </span>
            </span>
          </h1>
          <div className="hero-ctas rv" style={{ "--i": 3 } as React.CSSProperties}>
            <a href="#work" className="btn btn-primary">
              Explore work
            </a>
            <a href="#contact" className="btn btn-ghost">
              Let&apos;s talk
            </a>
            <a href={PROFILE.resume} download="Sudip_Koirala_Resume.pdf" className="btn btn-ghost">
              Resume <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="hero-right rv" style={{ "--i": 4 } as React.CSSProperties}>
          <ul className="hero-roles">
            {PROFILE.roles.map((r, i) => (
              <li key={r}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {r}
              </li>
            ))}
          </ul>
          <div ref={controls} className="hero-ctrl">
            {blocked ? (
              <button type="button" className="hero-btn hero-tap" aria-label="Turn on intro video sound" onClick={turnSoundOn}>
                <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
                  <path d="M2 6h2.6L8 3v10L4.6 10H2z" fill="currentColor" />
                  <path d="M10.5 6l3.5 4M14 6l-3.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                </svg>
                <span aria-hidden="true">Tap for sound</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="hero-btn hero-mute"
                  aria-label={muted ? "Unmute intro video" : "Mute intro video"}
                  aria-pressed={muted}
                  onClick={toggleMute}
                >
                  <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
                    <path d="M2 6h2.6L8 3v10L4.6 10H2z" fill="currentColor" />
                    {muted ? (
                      <path d="M10.5 6l3.5 4M14 6l-3.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                    ) : (
                      <path d="M10.4 5.6a3.4 3.4 0 010 4.8M12.3 3.8a6 6 0 010 8.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                    )}
                  </svg>
                </button>
                <button
                  type="button"
                  className="hero-btn hero-play"
                  aria-label={paused ? "Play intro video" : "Pause intro video"}
                  onClick={togglePlay}
                >
                  {paused ? (
                    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                      <path d="M4.5 2.6v10.8c0 .6.6.9 1.1.6l8.4-5.4a.7.7 0 000-1.2L5.6 2c-.5-.3-1.1 0-1.1.6z" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                      <rect x="3" y="2.5" width="3.2" height="11" rx="1" fill="currentColor" />
                      <rect x="9.8" y="2.5" width="3.2" height="11" rx="1" fill="currentColor" />
                    </svg>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style href="hero" precedence="default">{`
        .hero{position:relative;min-height:100svh;overflow:clip;display:flex;flex-direction:column;justify-content:flex-end;isolation:isolate;background:var(--paper)}
        .hero-ghost{position:absolute;left:50%;top:44%;z-index:-1;margin:0;transform:translate(-50%,-50%);font-weight:800;font-size:clamp(120px,27vw,460px);line-height:.8;letter-spacing:-.06em;color:transparent;-webkit-text-stroke:1.2px rgba(13,13,13,.16);white-space:nowrap;user-select:none;pointer-events:none;animation:heroGhost 1.6s var(--ease) both}
        @keyframes heroGhost{from{opacity:0;transform:translate(-50%,-46%) scale(.96)}}
        .hero-stage{position:absolute;left:50%;bottom:0;transform:translateX(-50%);height:min(96svh,1040px);aspect-ratio:768/960;z-index:0;mix-blend-mode:multiply;animation:heroIn 1.4s var(--ease) both}
        @keyframes heroIn{from{transform:translate(-50%,28px)}to{transform:translateX(-50%)}}
        .hero-video{display:block;width:100%;height:100%;object-fit:cover;mix-blend-mode:multiply}
        .hero-copy{position:relative;z-index:1;display:flex;align-items:flex-end;justify-content:space-between;gap:32px;padding-bottom:clamp(28px,6vh,64px);pointer-events:none}
        .hero-copy>*{pointer-events:auto}
        .hero-title{margin-top:18px;font-weight:700;font-size:clamp(46px,5.6vw,96px);letter-spacing:-.045em;line-height:.96}
        .hero-ctas{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}
        .hero-right{display:flex;flex-direction:column;align-items:flex-end;gap:22px}
        .hero-roles{list-style:none;margin:0;padding:0;text-align:right;font-size:15px;line-height:1.75;color:var(--ink-2)}
        .hero-roles span{margin-right:10px;font-family:var(--font-mono);font-size:11px;color:var(--mute)}
        .hero-ctrl{display:flex;gap:10px}
        .hero-btn{position:relative;display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:var(--ink);color:#fff;transition:transform .5s var(--ease),background-color .4s var(--ease)}
        .hero-btn:hover{transform:translateY(-2px) scale(1.04);background:#262626}
        .hero-mute{background:var(--paper);color:var(--ink);box-shadow:inset 0 0 0 1.5px var(--ink)}
        .hero-mute:hover{background:#fff}
        .hero-tap{grid-auto-flow:column;gap:8px;width:auto;padding:0 18px 0 15px;border-radius:999px;font-size:13.5px;font-weight:500;white-space:nowrap}
        .hero-tap::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:0 0 0 1.5px var(--ink);animation:heroPing 1.8s var(--ease) infinite}
        @keyframes heroPing{from{transform:scale(1);opacity:.55}to{transform:scale(1.15,1.5);opacity:0}}

        @media (max-width: 1099px){
          .hero{justify-content:flex-start;padding-top:72px}
          .hero-stage{position:relative;left:auto;bottom:auto;transform:none;margin-inline:auto;height:min(62svh,720px);max-width:100%;animation-name:heroInM}
          @keyframes heroInM{from{transform:translateY(28px)}to{transform:none}}
          .hero-ghost{top:34%}
          .hero-copy{flex-direction:column;align-items:stretch;gap:20px;margin-top:-8px}
          .hero-right{position:absolute;right:var(--gutter);top:-70px;flex-direction:row;align-items:center}
          .hero-roles{display:none}
        }
        @media (max-width: 420px){
          .hero-ctas .btn{flex:1 1 auto;padding-inline:16px}
        }
      `}</style>
    </section>
  );
}
