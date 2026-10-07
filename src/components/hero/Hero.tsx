"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";

const UNLOCK_EVENTS = ["pointerdown", "keydown", "touchend"] as const;

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const soundBtn = useRef<HTMLButtonElement>(null);
  const [soundOn, setSoundOn] = useState(false);
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
        setSoundOn(false);
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
      if (userPaused.current || soundBtn.current?.contains(e.target as Node)) return;
      v.muted = false;
      setSoundOn(true);
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
        setSoundOn(true);
        cleanup();
      })
      .catch(() => {
        v.muted = true;
        setSoundOn(false);
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

  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    if (soundOn) {
      v.pause();
      userPaused.current = true;
      setSoundOn(false);
    } else {
      v.muted = false;
      userPaused.current = false;
      setSoundOn(true);
      setBlocked(false);
      play();
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
          <button
            ref={soundBtn}
            type="button"
            className={`hero-sound ${blocked ? "is-blocked" : ""}`}
            aria-label={soundOn ? "Pause intro video" : "Play intro video with sound"}
            aria-pressed={soundOn}
            onClick={toggleSound}
          >
            {soundOn ? (
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <rect x="3" y="2.5" width="3.2" height="11" rx="1" fill="currentColor" />
                <rect x="9.8" y="2.5" width="3.2" height="11" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path d="M4.5 2.6v10.8c0 .6.6.9 1.1.6l8.4-5.4a.7.7 0 000-1.2L5.6 2c-.5-.3-1.1 0-1.1.6z" fill="currentColor" />
              </svg>
            )}
          </button>
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
        .hero-sound{position:relative;display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:var(--ink);color:#fff;transition:transform .5s var(--ease),background-color .4s var(--ease)}
        .hero-sound:hover{transform:translateY(-2px) scale(1.04);background:#262626}
        .hero-sound.is-blocked::after{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 1.5px var(--ink);animation:heroPing 1.8s var(--ease) infinite}
        @keyframes heroPing{from{transform:scale(1);opacity:.55}to{transform:scale(1.9);opacity:0}}

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
