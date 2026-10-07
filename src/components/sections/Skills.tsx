"use client";

import { useEffect, useRef, useState } from "react";
import { SKILL_GROUPS, SKILLS, usesOf, type Family } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import SectionHeading from "../ui/SectionHeading";
import TechLogo, { brandColor, isBrand } from "../ui/TechLogo";

const FAMILIES = SKILL_GROUPS.map((g) => g.family);

export default function Skills() {
  const [activeId, setActiveId] = useState(SKILLS[0].id);
  const [family, setFamily] = useState<Family | null>(null);
  const grid = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const skill = SKILLS.find((s) => s.id === activeId)!;
  const atomic = SKILLS.indexOf(skill) + 1;
  const uses = usesOf(skill.id);
  const tint = brandColor(skill.logo);

  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title" tabIndex={-1}>
      <div className="wrap">
        <SectionHeading id="skills-title" index="02" label="Skills" lines={["The periodic table", "of my"]} accent="stack." />

        <div className="sk-chips rv" role="group" aria-label="Filter skills by family">
          <button type="button" className="sk-chip" aria-pressed={family === null} onClick={() => setFamily(null)}>
            All <span>{SKILLS.length}</span>
          </button>
          {FAMILIES.map((f) => (
            <button
              key={f}
              type="button"
              className="sk-chip"
              aria-pressed={family === f}
              onClick={() => setFamily((cur) => (cur === f ? null : f))}
            >
              {f} <span>{SKILL_GROUPS.find((g) => g.family === f)!.skills.length}</span>
            </button>
          ))}
        </div>

        <div className="sk-layout">
          <ol ref={grid} className="sk-grid" aria-label="Skills">
            {SKILLS.map((s, i) => {
              const dim = family !== null && s.family !== family;
              const style = {
                "--d8": Math.floor(i / 8) + (i % 8),
                "--d4": Math.floor(i / 4) + (i % 4),
              } as React.CSSProperties;
              return (
                <li key={s.id} style={style}>
                  <button
                    type="button"
                    className={`sk-tile ${s.id === activeId ? "is-active" : ""} ${dim ? "is-dim" : ""}`}
                    onPointerEnter={() => setActiveId(s.id)}
                    onFocus={() => setActiveId(s.id)}
                    onClick={() => setActiveId(s.id)}
                    aria-label={`${s.name}, ${s.family}`}
                    aria-controls="sk-inspector"
                  >
                    <span className="sk-n">{i + 1}</span>
                    <span className="sk-sym">{s.symbol}</span>
                    <span className="sk-name">{s.short ?? s.name}</span>
                    <span className="sk-fam">{s.family}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <aside id="sk-inspector" className="sk-insp card" aria-live="polite" aria-label="Selected skill">
            <div className="sk-insp-top">
              <span>{String(atomic).padStart(2, "0")}</span>
              <span>{skill.symbol}</span>
            </div>
            <div className="sk-logo" style={tint ? ({ "--tint": tint } as React.CSSProperties) : undefined}>
              {tint && <span className="sk-glow" aria-hidden="true" />}
              <span key={skill.id} className={`sk-logo-pop ${isBrand(skill.logo) ? "" : "is-concept"}`}>
                <TechLogo name={skill.logo} size={150} />
              </span>
            </div>
            <h3 className="sk-insp-name">{skill.name}</h3>
            <p className="sk-insp-fam">
              {skill.family}
              {skill.listedUnder && <> · listed under “{skill.listedUnder}”</>}
            </p>
            <div className="sk-insp-uses">
              <p>Used in</p>
              {uses.projects.length + uses.roles.length === 0 ? (
                <span className="sk-none">Listed in my resume skills</span>
              ) : (
                <ul>
                  {uses.projects.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                  {uses.roles.map((r) => (
                    <li key={r} className="is-role">
                      {r}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </div>

      <style href="skills" precedence="default">{`
        .sk-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:40px}
        .sk-chip{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 14px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(13,13,13,.16);font-size:13.5px;font-weight:500;color:var(--ink-2);transition:background-color .4s var(--ease),color .4s var(--ease),box-shadow .4s var(--ease),transform .5s var(--ease)}
        .sk-chip span{font-family:var(--font-mono);font-size:10.5px;color:var(--mute);transition:color .4s}
        .sk-chip:hover{transform:translateY(-1px);box-shadow:inset 0 0 0 1px var(--ink)}
        .sk-chip[aria-pressed="true"]{background:var(--ink);color:#fff;box-shadow:inset 0 0 0 1px var(--ink)}
        .sk-chip[aria-pressed="true"] span{color:rgba(255,255,255,.6)}

        .sk-layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:24px;align-items:start;margin-top:28px}
        .sk-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px;list-style:none;margin:0;padding:0}
        .sk-grid li{min-width:0}
        .js .sk-grid:not(.is-in) .sk-tile{opacity:0}
        .sk-grid.is-in .sk-tile{animation:skIn .8s var(--ease) backwards;animation-delay:calc(var(--d8) * 40ms)}
        @keyframes skIn{from{opacity:0;transform:translateY(18px) scale(.94)}}

        .sk-tile{position:relative;display:flex;flex-direction:column;width:100%;aspect-ratio:1/1.08;padding:10px 11px;border-radius:16px;background:var(--card);box-shadow:var(--hair);text-align:left;overflow:hidden;transition:background-color .35s var(--ease),color .35s var(--ease),box-shadow .45s var(--ease),transform .5s var(--ease),opacity .45s var(--ease),filter .45s}
        .sk-tile:hover{transform:translateY(-3px);box-shadow:var(--hair),0 16px 30px -18px rgba(13,13,13,.35)}
        .sk-tile.is-active{background:var(--ink);color:#fff;box-shadow:0 18px 34px -16px rgba(13,13,13,.5)}
        .sk-tile.is-dim{opacity:.22;filter:grayscale(1)}
        .sk-n{font-family:var(--font-mono);font-size:10px;color:var(--mute)}
        .sk-sym{margin-top:auto;font-weight:700;font-size:clamp(20px,2.3vw,32px);letter-spacing:-.04em;line-height:1}
        .sk-name{margin-top:6px;font-size:11.5px;font-weight:500;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .sk-fam{margin-top:2px;font-family:var(--font-mono);font-size:9px;letter-spacing:.02em;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .sk-tile.is-active .sk-n,.sk-tile.is-active .sk-fam{color:rgba(255,255,255,.55)}

        .sk-insp{position:sticky;top:96px;padding:20px 22px 22px;border-radius:26px;box-shadow:var(--hair),var(--lift)}
        .sk-insp-top{display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:11px;color:var(--mute)}
        .sk-logo{position:relative;display:grid;place-items:center;height:190px;margin-top:6px}
        .sk-glow{position:absolute;width:150px;height:150px;border-radius:50%;background:var(--tint);opacity:.16;filter:blur(34px);transition:background-color .5s}
        .sk-logo-pop{position:relative;display:grid;place-items:center;animation:skPop .7s var(--ease) both}
        .sk-logo-pop.is-concept{color:var(--ink)}
        @keyframes skPop{0%{opacity:0;transform:scale(.6) rotate(-8deg)}60%{opacity:1;transform:scale(1.06)}100%{transform:none}}
        .sk-insp-name{margin-top:8px;font-weight:700;font-size:24px;letter-spacing:-.035em;line-height:1.1}
        .sk-insp-fam{margin-top:4px;font-size:13px;color:var(--mute)}
        .sk-insp-uses{margin-top:18px;padding-top:14px;border-top:1px solid var(--line)}
        .sk-insp-uses>p{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
        .sk-insp-uses ul{list-style:none;margin:8px 0 0;padding:0}
        .sk-insp-uses li{position:relative;padding:5px 0 5px 16px;font-size:13.5px;line-height:1.35}
        .sk-insp-uses li::before{content:"";position:absolute;left:0;top:11px;width:7px;height:7px;border-radius:50%;background:var(--ink)}
        .sk-insp-uses li.is-role{color:var(--mute)}
        .sk-insp-uses li.is-role::before{background:none;box-shadow:inset 0 0 0 1.5px var(--faint)}
        .sk-none{display:block;margin-top:8px;font-size:13.5px;color:var(--mute)}

        @media (max-width: 1023px){
          .sk-layout{grid-template-columns:minmax(0,1fr)}
          .sk-insp{position:relative;top:auto}
          .sk-logo{height:170px}
        }
        @media (max-width: 720px){
          .sk-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
          .sk-grid.is-in .sk-tile{animation-delay:calc(var(--d4) * 40ms)}
          .sk-tile{padding:8px 8px;border-radius:13px}
          .sk-fam{display:none}
          .sk-name{font-size:10.5px}
          .sk-sym{font-size:22px}
        }
      `}</style>
    </section>
  );
}
