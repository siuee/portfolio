"use client";

import { useState } from "react";
import { PROJECTS, SKILL_BY_ID } from "@/lib/data";
import SectionHeading from "../ui/SectionHeading";
import TechLogo from "../ui/TechLogo";
import MiniUI from "../ui/MiniUI";

export default function Work() {
  const [open, setOpen] = useState(0);

  return (
    <section id="work" className="section work" aria-labelledby="work-title" tabIndex={-1}>
      <div className="wrap">
        <div className="wk-head">
          <SectionHeading id="work-title" index="04" label="Selected work" lines={["Things I've"]} accent="built." />
          <p className="wk-count rv">
            {String(PROJECTS.length).padStart(2, "0")} projects · from my resume
          </p>
        </div>

        <div className="wk-panels rv">
          {PROJECTS.map((p, i) => {
            const isOpen = i === open;
            return (
              <article
                key={p.id}
                className={`wk-panel ${isOpen ? "is-open" : ""}`}
                aria-labelledby={`wk-t-${p.id}`}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") setOpen(i);
                }}
                onFocusCapture={() => setOpen(i)}
              >
                <button
                  type="button"
                  className="wk-spine"
                  aria-expanded={isOpen}
                  aria-controls={`wk-c-${p.id}`}
                  onClick={() => setOpen(i)}
                >
                  <span className="wk-spine-n">{p.index}</span>
                  <span className="wk-spine-t">{p.title}</span>
                  <span className="wk-plus" aria-hidden="true">
                    +
                  </span>
                </button>

                <div id={`wk-c-${p.id}`} className="wk-body" aria-hidden={!isOpen}>
                  <div className="wk-body-in">
                    <div className="wk-info">
                      <p className="wk-kicker">
                        <b>{p.index}</b> {p.kicker}
                      </p>
                      <h3 id={`wk-t-${p.id}`} className="wk-title">
                        {p.title}
                      </h3>
                      <p className="wk-desc">{p.description}</p>
                      <ul className="wk-feats">
                        {p.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                      <ul className="wk-tech" aria-label="Tech">
                        {p.tech.map((t) => {
                          const s = SKILL_BY_ID[t];
                          return (
                            <li key={t} className="chip">
                              <TechLogo name={s.logo} size={15} />
                              {s.name}
                            </li>
                          );
                        })}
                      </ul>
                      {(p.github || p.live) && (
                        <div className="wk-links">
                          {p.github && (
                            <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" tabIndex={isOpen ? 0 : -1}>
                              View on GitHub <span aria-hidden="true">↗</span>
                            </a>
                          )}
                          {p.live && (
                            <a href={p.live} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" tabIndex={isOpen ? 0 : -1}>
                              Live site <span aria-hidden="true">↗</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="wk-visual">
                      <MiniUI id={p.id} />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style href="work" precedence="default">{`
        .wk-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap}
        .wk-count{font-family:var(--font-mono);font-size:12px;color:var(--mute)}
        .wk-panels{display:flex;gap:10px;height:min(78svh,600px);margin-top:48px}
        .wk-panel{position:relative;flex:1 1 0;min-width:64px;border-radius:26px;background:var(--card);box-shadow:var(--hair);overflow:hidden;transition:flex-grow .9s var(--ease),box-shadow .6s var(--ease)}
        .wk-panel.is-open{flex-grow:8;box-shadow:var(--hair),var(--lift)}
        .wk-panel:focus-within{box-shadow:inset 0 0 0 1.5px var(--ink),var(--lift)}

        .wk-spine{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:22px 0;border-radius:inherit;transition:opacity .4s var(--ease)}
        .wk-spine:focus-visible{outline:none}
        .wk-panel.is-open .wk-spine{opacity:0;pointer-events:none}
        .wk-spine-n{font-family:var(--font-mono);font-size:12px;color:var(--mute)}
        .wk-spine-t{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:600;font-size:17px;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-height:calc(100% - 110px)}
        .wk-plus{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);font-size:18px;font-weight:300;line-height:1;transition:transform .6s var(--ease),background-color .4s,color .4s}
        .wk-spine:hover .wk-plus{transform:rotate(90deg);background:var(--ink);color:#fff}

        .wk-body{position:absolute;inset:0;opacity:0;visibility:hidden;transition:opacity .5s var(--ease),visibility 0s .5s}
        .wk-panel.is-open .wk-body{opacity:1;visibility:visible;transition:opacity .7s var(--ease) .25s,visibility 0s}
        .wk-body-in{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:28px;height:100%;min-width:760px;padding:30px}
        .wk-info{display:flex;flex-direction:column;min-width:0;overflow:auto}
        .wk-kicker{font-family:var(--font-mono);font-size:11.5px;letter-spacing:.04em;text-transform:uppercase;color:var(--mute)}
        .wk-kicker b{color:var(--ink);font-weight:500;margin-right:8px}
        .wk-title{margin-top:14px;font-weight:700;font-size:clamp(26px,2.6vw,38px);letter-spacing:-.04em;line-height:1.02}
        .wk-desc{margin-top:14px;font-size:14.5px;line-height:1.55;color:var(--ink-2)}
        .wk-feats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 18px;margin:18px 0 0;padding:0;list-style:none}
        .wk-feats li{position:relative;padding:5px 0 5px 14px;border-top:1px solid var(--line);font-size:12.5px;line-height:1.35}
        .wk-feats li::before{content:"";position:absolute;left:0;top:11px;width:5px;height:5px;border-radius:50%;background:var(--ink)}
        .wk-tech{display:flex;flex-wrap:wrap;gap:6px;margin:18px 0 0;padding:0;list-style:none}
        .wk-tech .chip{height:28px;font-size:12px;padding-inline:10px}
        .wk-links{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto;padding-top:18px}
        .wk-visual{min-width:0;clip-path:inset(0 0 0 100% round 20px);transition:clip-path 1.1s var(--ease)}
        .wk-panel.is-open .wk-visual{clip-path:inset(0 0 0 0 round 20px);transition-delay:.3s}

        @media (max-width: 1199px) and (min-width: 900px){
          .wk-body-in{grid-template-columns:minmax(0,1fr);min-width:560px}
          .wk-visual{display:none}
        }
        @media (max-width: 899px){
          .wk-panels{flex-direction:column;height:auto;gap:8px}
          .wk-panel{flex:none;display:grid;grid-template-rows:auto 0fr;transition:grid-template-rows .8s var(--ease),box-shadow .6s var(--ease)}
          .wk-panel.is-open{grid-template-rows:auto 1fr}
          .wk-spine{position:relative;inset:auto;flex-direction:row;justify-content:flex-start;gap:14px;padding:18px 18px;text-align:left}
          .wk-panel.is-open .wk-spine{opacity:1;pointer-events:auto}
          .wk-spine-t{writing-mode:horizontal-tb;transform:none;flex:1;max-height:none;font-size:16px}
          .wk-panel.is-open .wk-plus{transform:rotate(45deg);background:var(--ink);color:#fff}
          .wk-body{position:relative;inset:auto;min-height:0;overflow:hidden}
          .wk-body-in{grid-template-columns:minmax(0,1fr);min-width:0;padding:0 18px 20px;height:auto}
          .wk-kicker{display:none}
          .wk-title{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
          .wk-visual{height:auto}
          .wk-visual .mui{height:auto}
          .wk-feats{grid-template-columns:minmax(0,1fr)}
        }
      `}</style>
    </section>
  );
}
