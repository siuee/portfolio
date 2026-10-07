"use client";

import { Fragment, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";

const LINES: { text: string; accent?: string }[] = [{ text: "Let's build" }, { text: "something", accent: "together." }];

function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, w) => (
        <Fragment key={w}>
          {w > 0 && " "}
          <span className="ct-word">
            {[...word].map((ch, i) => (
              <span key={i} className="ct-l">
                {ch}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = PROFILE.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2200);
  };

  const hop = (e: React.PointerEvent) => {
    const t = e.target as HTMLElement;
    if (!t.classList.contains("ct-l") || t.classList.contains("is-hop")) return;
    t.classList.add("is-hop");
    t.addEventListener("animationend", () => t.classList.remove("is-hop"), { once: true });
  };

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title" tabIndex={-1}>
      <div className="wrap">
        <p className="tag rv">
          <b>06</b>
          <span aria-hidden="true">—</span>Contact
        </p>

        <h2 id="contact-title" className="ct-title" aria-label="Let's build something together." onPointerOver={hop}>
          {LINES.map((l, i) => (
            <span key={i} className="rv-mask" style={{ "--i": i } as React.CSSProperties}>
              <span aria-hidden="true">
                <Letters text={l.text} />
                {l.accent && (
                  <>
                    {" "}
                    <em className="accent">
                      <Letters text={l.accent} />
                    </em>
                  </>
                )}
              </span>
            </span>
          ))}
        </h2>

        <div className="ct-grid">
          <div className="ct-main rv">
            <p className="ct-label">Email</p>
            <div className="ct-email-row">
              <a href={`mailto:${PROFILE.email}`} className="ct-email">
                {PROFILE.email}
              </a>
              <button type="button" className={`ct-copy ${copied ? "is-done" : ""}`} onClick={copy}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied to clipboard" : ""}
              </span>
            </div>

            <ul className="ct-links">
              <li>
                <span>Phone</span>
                <a href={PROFILE.phoneHref}>{PROFILE.phone}</a>
              </li>
              <li>
                <span>GitHub</span>
                <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
                  github.com/siuee <i aria-hidden="true">↗</i>
                </a>
              </li>
              <li>
                <span>LinkedIn</span>
                <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
                  {PROFILE.linkedinLabel.replace("linkedin.com/in/", "in/")} <i aria-hidden="true">↗</i>
                </a>
              </li>
              <li>
                <span>Based in</span>
                <p>{PROFILE.location}</p>
              </li>
            </ul>
          </div>

          <a href={`mailto:${PROFILE.email}`} className="ct-badge rv" aria-label="Say hello by email" style={{ "--i": 2 } as React.CSSProperties}>
            <svg viewBox="0 0 200 200" aria-hidden="true">
              <defs>
                <path id="ct-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
              </defs>
              <text>
                <textPath href="#ct-circle" textLength="488">
                  SAY HELLO · SAY HELLO · SAY HELLO ·
                </textPath>
              </text>
            </svg>
            <span className="ct-badge-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </div>

      <style href="contact" precedence="default">{`
        .ct-title{margin-top:28px;font-weight:700;font-size:clamp(44px,8vw,140px);letter-spacing:-.05em;line-height:.98}
        .ct-word{display:inline-block;white-space:nowrap}
        .ct-l{display:inline-block;will-change:transform}
        .ct-l.is-hop{animation:ctHop .7s var(--ease)}
        @keyframes ctHop{0%{transform:none}30%{transform:translateY(-.16em)}55%{transform:translateY(.03em)}75%{transform:translateY(-.04em)}100%{transform:none}}
        .ct-title .accent .ct-l{letter-spacing:-.01em}

        .ct-grid{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:48px;align-items:end;margin-top:clamp(48px,7vw,96px)}
        .ct-label,.ct-links span{font-family:var(--font-mono);font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
        .ct-email-row{display:flex;flex-wrap:wrap;align-items:center;gap:14px 18px;margin-top:12px}
        .ct-email{font-weight:600;font-size:clamp(22px,4.2vw,58px);letter-spacing:-.04em;line-height:1.1;overflow-wrap:anywhere;text-decoration:underline;text-decoration-thickness:1.5px;text-underline-offset:.16em;text-decoration-color:rgba(13,13,13,.3);transition:text-decoration-color .4s var(--ease)}
        .ct-email:hover{text-decoration-color:var(--ink)}
        .ct-copy{height:36px;padding:0 16px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(13,13,13,.22);font-family:var(--font-mono);font-size:12px;transition:background-color .4s var(--ease),color .4s var(--ease),transform .5s var(--ease)}
        .ct-copy:hover{transform:translateY(-1px);background:var(--ink);color:#fff}
        .ct-copy.is-done{background:var(--ink);color:#fff}
        .ct-links{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;margin:48px 0 0;padding:0;list-style:none}
        .ct-links li{display:flex;flex-direction:column;gap:8px;padding-top:16px;border-top:1px solid var(--line);min-width:0}
        .ct-links a,.ct-links p{font-size:16px;font-weight:500;overflow-wrap:anywhere}
        .ct-links a i{font-style:normal;display:inline-block;transition:transform .5s var(--ease)}
        .ct-links a:hover i{transform:translate(3px,-3px)}

        .ct-badge{position:relative;display:grid;place-items:center;width:156px;height:156px;border-radius:50%}
        .ct-badge svg{position:absolute;inset:0;width:100%;height:100%;animation:ctSpin 22s linear infinite}
        .ct-badge text{font-family:var(--font-mono);font-size:15px;letter-spacing:.12em;fill:var(--ink)}
        .ct-badge-arrow{display:grid;place-items:center;width:62px;height:62px;border-radius:50%;background:var(--ink);color:#fff;font-size:22px;transition:transform .6s var(--ease)}
        .ct-badge:hover .ct-badge-arrow{transform:rotate(45deg) scale(1.06)}
        @keyframes ctSpin{to{transform:rotate(360deg)}}

        @media (max-width: 900px){
          .ct-grid{grid-template-columns:minmax(0,1fr)}
          .ct-links{grid-template-columns:repeat(2,minmax(0,1fr))}
          .ct-badge{justify-self:end;width:128px;height:128px}
        }
        @media (max-width: 420px){ .ct-links{grid-template-columns:minmax(0,1fr)} }
      `}</style>
    </section>
  );
}
