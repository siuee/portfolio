"use client";

import { useState } from "react";
import { HOMELABS } from "@/lib/data";
import SectionHeading from "../ui/SectionHeading";
import TechLogo from "../ui/TechLogo";

export default function Homelab() {
  const [active, setActive] = useState(0);
  const lab = HOMELABS[active];

  return (
    <section id="homelab" className="section homelab" aria-labelledby="homelab-title" tabIndex={-1}>
      <div className="wrap">
        <SectionHeading
          id="homelab-title"
          index="03"
          label="Security homelab"
          lines={["Security homelab", "experience"]}
          accent="labs."
        />

        <div className="hl-layout rv">
          <div className="hl-rack" role="tablist" aria-label="Homelab environments">
            {HOMELABS.map((l, i) => (
              <button
                key={l.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls={`hl-panel-${l.id}`}
                id={`hl-tab-${l.id}`}
                className={`hl-unit ${i === active ? "is-active" : ""}`}
                onClick={() => setActive(i)}
              >
                <span className="hl-led" aria-hidden="true" />
                <span className="hl-unit-n">{l.index}</span>
                <span className="hl-unit-t">{l.title.split("(")[0].trim()}</span>
              </button>
            ))}
            <span className="hl-rack-foot" aria-hidden="true">
              LAB RACK · {HOMELABS.length} ENV
            </span>
          </div>

          <article
            id={`hl-panel-${lab.id}`}
            role="tabpanel"
            aria-labelledby={`hl-tab-${lab.id}`}
            className="hl-panel card"
          >
            <p className="hl-kicker">
              <b>{lab.index}</b> Security Homelab Experience
            </p>
            <h3 className="hl-title">{lab.title}</h3>
            <ul className="hl-list">
              {lab.highlights.map((h) => (
                <li key={h.slice(0, 48)}>{h}</li>
              ))}
            </ul>
            <p className="hl-tech-label">Tech</p>
            <ul className="hl-tech">
              {lab.tech.map((t) => (
                <li key={t.id} className="chip">
                  <TechLogo name={t.logo} size={15} />
                  {t.name}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>

      <style href="homelab" precedence="default">{`
        .hl-layout{display:grid;grid-template-columns:minmax(0,280px) minmax(0,1fr);gap:clamp(20px,3vw,36px);align-items:start;margin-top:48px}
        .hl-rack{display:flex;flex-direction:column;gap:10px;padding:18px 16px 14px;border-radius:26px;background:var(--card);box-shadow:var(--hair),inset 0 1px 0 rgba(255,255,255,.8)}
        .hl-unit{position:relative;display:grid;grid-template-columns:10px 32px minmax(0,1fr);align-items:center;gap:12px;padding:14px 12px;border-radius:16px;text-align:left;transition:background-color .45s var(--ease),transform .5s var(--ease),box-shadow .45s}
        .hl-unit:hover{transform:translateX(4px)}
        .hl-unit.is-active{background:var(--ink);color:#fff;box-shadow:0 16px 28px -18px rgba(13,13,13,.45)}
        .hl-led{width:8px;height:8px;border-radius:50%;background:var(--soft);box-shadow:inset 0 0 0 1px var(--line);transition:background-color .4s,box-shadow .4s}
        .hl-unit.is-active .hl-led{background:#6cff8a;box-shadow:0 0 12px rgba(108,255,138,.55)}
        .hl-unit-n{font-family:var(--font-mono);font-size:11px;color:var(--mute)}
        .hl-unit.is-active .hl-unit-n{color:rgba(255,255,255,.55)}
        .hl-unit-t{font-size:13px;font-weight:600;line-height:1.25;letter-spacing:-.01em}
        .hl-rack-foot{margin-top:6px;padding-top:12px;border-top:1px solid var(--line);font-family:var(--font-mono);font-size:9px;letter-spacing:.14em;text-align:center;color:var(--mute)}

        .hl-panel{padding:clamp(24px,3vw,32px);border-radius:28px;box-shadow:var(--hair),var(--lift);animation:hlIn .7s var(--ease) both}
        @keyframes hlIn{from{opacity:0;transform:translateY(12px)}}
        .hl-kicker{font-family:var(--font-mono);font-size:11.5px;letter-spacing:.04em;text-transform:uppercase;color:var(--mute)}
        .hl-kicker b{color:var(--ink);font-weight:500;margin-right:8px}
        .hl-title{margin-top:12px;font-weight:700;font-size:clamp(22px,2.4vw,30px);letter-spacing:-.035em;line-height:1.08}
        .hl-list{margin:18px 0 0;padding:0;list-style:none}
        .hl-list li{position:relative;padding:10px 0 10px 16px;border-top:1px solid var(--line);font-size:14.5px;line-height:1.55;color:var(--ink-2)}
        .hl-list li::before{content:"";position:absolute;left:0;top:17px;width:6px;height:1.5px;background:var(--ink)}
        .hl-tech-label{margin:20px 0 0;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--faint)}
        .hl-tech{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 0;padding:0;list-style:none}
        .hl-tech .chip{height:28px;font-size:12px;padding-inline:10px}

        @media (max-width: 860px){
          .hl-layout{grid-template-columns:minmax(0,1fr)}
          .hl-rack{flex-direction:row;flex-wrap:wrap;padding:12px}
          .hl-unit{flex:1 1 calc(50% - 8px);grid-template-columns:8px 28px 1fr}
          .hl-rack-foot{flex:1 1 100%}
        }
      `}</style>
    </section>
  );
}
