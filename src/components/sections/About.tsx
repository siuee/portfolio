"use client";

import { useEffect, useRef, useState } from "react";
import { EDUCATION, EXPERIENCE, PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";

const degree = EDUCATION[0];
const current = EXPERIENCE.find((e) => e.end === "Present");

const BACK_LINES = [
  PROFILE.roles.join(" · "),
  `${degree.title}, ${degree.place} · ${degree.year}`,
  "SIEM/SOC telemetry (Wazuh, ELK, Splunk) · GOAD · YARA detection engineering",
  "AES/RSA encryption · FIFA Tournament Manager · Nepal Import Analytics",
  "Published “Clef” on the Google Play Store",
];

/** Deterministic barcode bars from the name, so it never changes between renders. */
function barcode(seed: string): { x: number; w: number }[] {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (const ch of (seed + seed).replace(/\s/g, "")) {
    const c = ch.charCodeAt(0);
    const w = 1 + (c % 3);
    bars.push({ x, w });
    x += w + 1 + ((c >> 2) % 3);
  }
  return bars;
}

export default function About() {
  const section = useRef<HTMLElement>(null);
  const rig = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const lastPointer = useRef<string>("mouse");

  // damped pendulum driven by pointer velocity, with an idle sway
  useEffect(() => {
    const sec = section.current;
    const el = rig.current;
    if (!sec || !el || prefersReducedMotion()) return;

    let theta = 0;
    let omega = 0;
    let raf = 0;
    let last = 0;
    let lastX: number | null = null;
    let lastMoveT = 0;
    let running = false;
    const K = 26; // stiffness (1/s²)
    const C = 3.2; // damping (1/s)

    const frame = (t: number) => {
      const dt = Math.min(0.033, last ? (t - last) / 1000 : 0.016);
      last = t;
      const quiet = t - lastMoveT > 1200;
      const rest = quiet ? Math.sin(t / 1400) * 1.4 : 0;
      omega += (-K * (theta - rest) - C * omega) * dt;
      theta = Math.max(-9, Math.min(9, theta + omega * dt));
      el.style.transform = `rotate(${theta.toFixed(3)}deg)`;
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (lastX !== null) {
        const dt = Math.max(8, now - lastMoveT) / 1000;
        const vx = (e.clientX - lastX) / dt;
        omega = Math.max(-40, Math.min(40, omega + vx * 0.0035));
      }
      lastX = e.clientX;
      lastMoveT = now;
    };
    const onLeave = () => {
      lastX = null;
    };

    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(sec);
    sec.addEventListener("pointermove", onMove, { passive: true });
    sec.addEventListener("pointerleave", onLeave);
    return () => {
      stop();
      io.disconnect();
      sec.removeEventListener("pointermove", onMove);
      sec.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const bars = barcode(PROFILE.name);
  const barW = bars.at(-1)!.x + bars.at(-1)!.w;
  const strap = `${PROFILE.name} · ${PROFILE.role} · `.toUpperCase();

  return (
    <section ref={section} id="about" className="section about" aria-labelledby="about-title" tabIndex={-1}>
      <div className="wrap about-grid">
        {/* left */}
        <div className="about-col about-left">
          <p className="tag rv">
            <b>01</b>
            <span aria-hidden="true">—</span>About
          </p>
          <h2 id="about-title" className="h-sec mt-5">
            <span className="rv-mask">
              <span>
                Hi, I&apos;m <em className="accent">{PROFILE.firstName}.</em>
              </span>
            </span>
          </h2>
          <p className="lede mt-8 rv" style={{ "--i": 1 } as React.CSSProperties}>
            {PROFILE.resumeSummary}
          </p>
          <p className="about-line mt-5 rv" style={{ "--i": 2 } as React.CSSProperties}>
            {PROFILE.aboutLine}
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5 rv" style={{ "--i": 3 } as React.CSSProperties}>
            <a href={PROFILE.resume} download="Sudip_Koirala_Resume.pdf" className="btn btn-primary">
              Resume <span aria-hidden="true">↓</span>
            </a>
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* centre: lanyard + ID card */}
        <div className="about-col about-lanyard">
          <div ref={rig} className="lan-rig">
            <span className="lan-cord" aria-hidden="true" />
            <div className="lan-strap" aria-hidden="true">
              <div className="lan-strap-track">
                <span>{strap.repeat(3)}</span>
                <span>{strap.repeat(3)}</span>
              </div>
            </div>
            <span className="lan-clip" aria-hidden="true">
              <i />
            </span>

            <div
              className={`idcard ${flipped ? "is-flipped" : ""}`}
              tabIndex={0}
              role="group"
              aria-roledescription="flip card"
              aria-label={`Developer ID card for ${PROFILE.name}. Press Enter to flip.`}
              onPointerEnter={(e) => {
                lastPointer.current = e.pointerType;
                if (e.pointerType === "mouse") setFlipped(true);
              }}
              onPointerLeave={(e) => {
                if (e.pointerType === "mouse") setFlipped(false);
              }}
              onPointerDown={(e) => (lastPointer.current = e.pointerType)}
              onClick={() => {
                if (lastPointer.current !== "mouse") setFlipped((f) => !f);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setFlipped((f) => !f);
                }
              }}
            >
              <div className="idcard-inner">
                {/* front */}
                <div className="idcard-face idcard-front" aria-hidden={flipped}>
                  <div className="idc-band">
                    <span>DEVELOPER ID</span>
                    <span className="idc-slot" aria-hidden="true" />
                    <span>{PROFILE.initials}</span>
                  </div>
                  <div className="idc-photo">
                    <img
                      src="/portrait-bust.webp"
                      alt={`Portrait of ${PROFILE.name}`}
                      width={480}
                      height={600}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <p className="idc-name">{PROFILE.name}</p>
                  <p className="idc-role">{PROFILE.role}</p>
                  <dl className="idc-rows">
                    <div>
                      <dt>Dept.</dt>
                      <dd>{PROFILE.dept}</dd>
                    </div>
                    <div>
                      <dt>Since</dt>
                      <dd>{PROFILE.since}</dd>
                    </div>
                    <div>
                      <dt>Valid till</dt>
                      <dd>{PROFILE.graduation}</dd>
                    </div>
                  </dl>
                  <div className="idc-foot" aria-hidden="true">
                    <svg viewBox={`0 0 ${barW} 20`} preserveAspectRatio="none" className="idc-barcode">
                      {bars.map((b, i) => (
                        <rect key={i} x={b.x} y="0" width={b.w} height="20" />
                      ))}
                    </svg>
                    <span className="idc-holo" />
                  </div>
                </div>

                {/* back */}
                <div className="idcard-face idcard-back" aria-hidden={!flipped}>
                  <p className="idc-back-tag">What I am</p>
                  <ul className="idc-back-list">
                    {BACK_LINES.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                  <div className="idc-sign">
                    <span>{PROFILE.name}</span>
                  </div>
                  <p className="idc-found">
                    If found, say hello · <br />
                    {PROFILE.email}
                  </p>
                </div>
              </div>
            </div>
            <p className="lan-hint" aria-hidden="true">
              Hover or tap to flip
            </p>
          </div>
        </div>

        {/* right */}
        <div className="about-col about-right">
          <p className="tag rv">Quick facts</p>
          <dl className="facts mt-6">
            <div className="rv" style={{ "--i": 1 } as React.CSSProperties}>
              <dt>Location</dt>
              <dd>{PROFILE.location}</dd>
            </div>
            <div className="rv" style={{ "--i": 2 } as React.CSSProperties}>
              <dt>Education</dt>
              <dd>
                {degree.title}
                <small>
                  {degree.place} · {degree.detail}
                </small>
              </dd>
            </div>
            {current && (
              <div className="rv" style={{ "--i": 3 } as React.CSSProperties}>
                <dt>Currently</dt>
                <dd>
                  {current.title}
                  <small>
                    {current.start} – {current.end} · {current.location}
                  </small>
                </dd>
              </div>
            )}
            <div className="rv" style={{ "--i": 4 } as React.CSSProperties}>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${PROFILE.email}`} className="facts-link">
                  {PROFILE.email}
                </a>
              </dd>
            </div>
          </dl>
          <blockquote className="about-quote rv" style={{ "--i": 5 } as React.CSSProperties}>
            <p>“{PROFILE.quote}”</p>
          </blockquote>
        </div>
      </div>

      <style href="about" precedence="default">{`
        .about-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(28px,4vw,64px);align-items:stretch}
        .about-col{min-width:0;display:flex;flex-direction:column}
        .about-line{font-size:15px;line-height:1.6;color:var(--mute);max-width:52ch}
        .about-left .h-sec{font-size:clamp(44px,5vw,76px)}

        .about-lanyard{align-items:center;margin-top:calc(-1 * var(--pad-y))}
        .lan-rig{display:flex;flex-direction:column;align-items:center;transform-origin:50% 0;will-change:transform}
        .lan-cord{display:block;width:1.5px;height:calc(var(--pad-y) - 12px);background:var(--faint)}
        .lan-strap{width:30px;height:56px;overflow:hidden;border-radius:4px 4px 2px 2px;background:var(--ink);color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}
        .lan-strap-track{display:flex;flex-direction:column;animation:lanStrap 16s linear infinite}
        .lan-strap-track span{writing-mode:vertical-rl;font-family:var(--font-mono);font-size:8.5px;letter-spacing:.18em;line-height:30px;white-space:nowrap;text-align:center}
        @keyframes lanStrap{to{transform:translateY(-50%)}}
        .lan-clip{position:relative;display:block;width:24px;height:22px;margin-top:-2px;border-radius:4px 4px 8px 8px;background:#c9c6c0;box-shadow:inset 0 1px 0 rgba(255,255,255,.8),inset 0 -2px 3px rgba(0,0,0,.18),0 2px 4px rgba(0,0,0,.12)}
        .lan-clip i{position:absolute;left:50%;bottom:-7px;width:10px;height:12px;margin-left:-5px;border-radius:0 0 6px 6px;border:2px solid #b3b0aa;border-top:0}
        .lan-hint{margin-top:16px;font-family:var(--font-mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}

        .idcard{position:relative;width:300px;height:404px;margin-top:4px;perspective:1400px;border-radius:24px;cursor:pointer;-webkit-tap-highlight-color:transparent}
        .idcard:focus-visible{outline-offset:6px;border-radius:26px}
        .idcard-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 1s var(--ease)}
        .idcard.is-flipped .idcard-inner{transform:rotateY(180deg)}
        .idcard-face{position:absolute;inset:0;overflow:hidden;border-radius:24px;background:var(--card);box-shadow:var(--hair),var(--lift);-webkit-backface-visibility:hidden;backface-visibility:hidden;display:flex;flex-direction:column;align-items:center}
        .idcard-back{transform:rotateY(180deg);align-items:stretch;padding:26px 24px 22px}

        .idc-band{position:relative;align-self:stretch;display:flex;justify-content:space-between;align-items:center;height:40px;padding:0 18px;background:var(--ink);color:#fff;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.2em}
        .idc-slot{position:absolute;left:50%;top:8px;width:42px;height:7px;margin-left:-21px;border-radius:99px;background:var(--paper);box-shadow:inset 0 1px 2px rgba(0,0,0,.4)}
        .idc-photo{position:relative;width:128px;height:156px;margin-top:16px;padding:3px;border-radius:20px;background:linear-gradient(145deg,#d9d6d0,#8d8a84 55%,#e9e6e0);box-shadow:0 0 0 7px rgba(13,13,13,.035),0 18px 36px -16px rgba(13,13,13,.45)}
        .idc-photo img{display:block;width:100%;height:100%;object-fit:cover;border-radius:17px;background:#fff;transition:transform .8s var(--ease)}
        .idcard:hover .idc-photo img{transform:scale(1.07)}
        .idc-photo{overflow:hidden}
        .idc-name{margin-top:12px;font-weight:700;font-size:21px;letter-spacing:-.035em}
        .idc-role{margin-top:2px;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
        .idc-rows{align-self:stretch;margin:10px 22px 0}
        .idc-rows div{display:flex;justify-content:space-between;padding:4px 0;border-top:1px solid var(--line);font-size:12px}
        .idc-rows dt{font-family:var(--font-mono);font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
        .idc-rows dd{margin:0;font-weight:500}
        .idc-foot{margin-top:auto;align-self:stretch;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:0 22px 16px}
        .idc-barcode{width:150px;height:22px;fill:var(--ink)}
        .idc-holo{position:relative;width:34px;height:34px;border-radius:50%;overflow:hidden;background:conic-gradient(from 0deg,#f4f2ee,#a9a6a0,#ffffff,#77756f,#e9e6e0,#c4c1bb,#f4f2ee);box-shadow:inset 0 0 0 1px rgba(13,13,13,.12)}
        .idc-holo::after{content:"";position:absolute;inset:-40%;background:linear-gradient(115deg,transparent 40%,rgba(255,255,255,.85) 50%,transparent 60%);animation:holo 3.6s var(--ease) infinite}
        @keyframes holo{from{transform:translateX(-60%)}to{transform:translateX(60%)}}

        .idc-back-tag{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--mute)}
        .idc-back-list{list-style:none;margin:14px 0 0;padding:0;counter-reset:b}
        .idc-back-list li{counter-increment:b;display:grid;grid-template-columns:22px 1fr;padding:8px 0;border-top:1px solid var(--line);font-size:12.5px;line-height:1.4;color:var(--ink-2)}
        .idc-back-list li::before{content:counter(b,decimal-leading-zero);font-family:var(--font-mono);font-size:9.5px;color:var(--mute);padding-top:2px}
        .idc-sign{margin-top:auto;padding-bottom:6px;border-bottom:1px solid var(--ink)}
        .idc-sign span{font-family:var(--font-serif);font-style:italic;font-size:30px;letter-spacing:-.01em}
        .idc-found{margin-top:10px;font-family:var(--font-mono);font-size:9.5px;line-height:1.5;color:var(--mute)}

        .facts>div{display:grid;grid-template-columns:96px minmax(0,1fr);gap:14px;padding:16px 0;border-top:1px solid var(--line)}
        .facts>div:last-child{border-bottom:1px solid var(--line)}
        .facts dt{font-family:var(--font-mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);padding-top:3px}
        .facts dd{margin:0;font-size:15px;font-weight:500;line-height:1.45;overflow-wrap:anywhere}
        .facts small{display:block;margin-top:2px;font-size:13px;font-weight:400;color:var(--mute)}
        .facts-link{background:linear-gradient(currentColor,currentColor) 0 100%/0 1px no-repeat;transition:background-size .5s var(--ease)}
        .facts-link:hover{background-size:100% 1px}
        .about-quote{margin:auto 0 0;padding-top:36px}
        .about-quote p{font-family:var(--font-serif);font-style:italic;font-size:clamp(24px,2.2vw,32px);line-height:1.18;letter-spacing:-.01em;color:var(--ink-2)}

        @media (max-width: 1099px){
          .about-grid{grid-template-columns:minmax(0,1fr) 320px}
          .about-right{grid-column:1 / -1}
          .about-quote{margin-top:0}
        }
        @media (max-width: 760px){
          .about-grid{grid-template-columns:minmax(0,1fr)}
          .about-lanyard{order:-1;margin-top:calc(-1 * var(--pad-y))}
          .about-right{grid-column:auto}
        }
        @media (max-width: 360px){ .idcard{transform:scale(.94);transform-origin:50% 0} }
      `}</style>
    </section>
  );
}
