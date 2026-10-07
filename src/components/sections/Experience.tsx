"use client";

import { useRef, useState } from "react";
import { EDUCATION, EXPERIENCE, SKILL_BY_ID } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import SectionHeading from "../ui/SectionHeading";

type Stop = {
  id: string;
  kind: "work" | "education";
  year: string;
  range: string;
  title: string;
  place: string;
  detail: string;
  highlights: string[];
  tech: string[];
};

const STOPS: Stop[] = [
  ...EXPERIENCE.map((e) => ({
    id: e.id,
    kind: e.kind,
    year: e.year,
    range: `${e.start} – ${e.end}`,
    title: e.title,
    place: `${e.place} · ${e.location}`,
    detail: e.detail,
    highlights: e.highlights,
    tech: e.tech,
  })),
  ...EDUCATION.map((e) => ({
    id: e.id,
    kind: e.kind,
    year: e.year,
    range: e.detail,
    title: e.title,
    place: `${e.place} · ${e.location}`,
    detail: "",
    highlights: [],
    tech: [],
  })),
].sort((a, b) => Number(a.year) - Number(b.year));

export default function Experience() {
  const list = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const [lit, setLit] = useState(0);

  useScrollProgress(list, (p) => {
    const ol = list.current;
    if (fill.current) fill.current.style.transform = `scaleY(${p})`;
    if (!ol) return;
    const h = ol.offsetHeight || 1;
    const dots = ol.querySelectorAll<HTMLElement>("[data-stop]");
    let n = 0;
    dots.forEach((d) => {
      if ((d.offsetTop + 14) / h <= p + 0.001) n++;
    });
    setLit((cur) => (cur === n ? cur : n));
  });

  return (
    <section id="experience" className="section experience" aria-labelledby="experience-title" tabIndex={-1}>
      <div className="wrap">
        <SectionHeading id="experience-title" index="04" label="Experience & education" lines={["Education and", "experience, one"]} accent="path." />

        <div ref={list} className="tl">
          <span className="tl-spine" aria-hidden="true">
            <span ref={fill} />
          </span>
          <ol className="tl-list">
          {STOPS.map((s, i) => (
            <li key={s.id} data-stop className={`tl-stop ${i < lit ? "is-lit" : ""}`}>
              <span className="tl-dot" aria-hidden="true" />
              <p className="tl-year">{s.year}</p>
              <div className="tl-card">
                <p className="tl-meta">
                  <span>{s.kind === "work" ? "Experience" : "Education"}</span>
                  {s.range}
                </p>
                <h3 className="tl-title">{s.title}</h3>
                <p className="tl-place">{s.place}</p>
                {s.detail && <p className="tl-detail">{s.detail}</p>}
                {s.tech.length > 0 && (
                  <ul className="tl-tech" aria-label="Tools">
                    {s.tech.map((t) => (
                      <li key={t}>{SKILL_BY_ID[t]?.short ?? SKILL_BY_ID[t]?.name}</li>
                    ))}
                  </ul>
                )}
                {s.highlights.length > 0 && (
                  <details className="tl-more">
                    <summary>
                      <span>{s.highlights.length} more highlights</span>
                      <i aria-hidden="true">+</i>
                    </summary>
                    <ul>
                      {s.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </li>
          ))}
          <li data-stop className={`tl-stop tl-next ${lit > STOPS.length ? "is-lit" : ""}`}>
            <span className="tl-dot" aria-hidden="true" />
            <p className="tl-year">Next</p>
            <a href="#contact" className="tl-card tl-card-next">
              <span className="tl-meta">Next —</span>
              <span className="tl-title">
                Your <em className="accent">team?</em>
              </span>
              <span className="tl-next-cta">
                Let&apos;s talk <span aria-hidden="true">→</span>
              </span>
            </a>
          </li>
          </ol>
        </div>
      </div>

      <style href="experience" precedence="default">{`
        .tl{position:relative;margin-top:64px;--x:180px}
        .tl-list{list-style:none;margin:0;padding:0}
        .tl-spine{position:absolute;left:var(--x);top:14px;bottom:30px;width:1.5px;background:var(--soft)}
        .tl-spine span{position:absolute;inset:0;background:var(--ink);transform:scaleY(0);transform-origin:50% 0;will-change:transform}
        .tl-stop{position:relative;display:grid;grid-template-columns:calc(var(--x) - 36px) minmax(0,1fr);gap:72px;padding-bottom:44px}
        .tl-dot{position:absolute;left:calc(var(--x) - 8px);top:7px;width:17px;height:17px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 1.5px var(--faint);transition:box-shadow .6s var(--ease),background-color .6s var(--ease),transform .6s var(--ease)}
        .tl-stop.is-lit .tl-dot{background:var(--ink);box-shadow:0 0 0 5px rgba(13,13,13,.08);transform:scale(1.1)}
        .tl-year{font-family:var(--font-mono);font-size:clamp(22px,2.4vw,34px);font-weight:500;letter-spacing:-.04em;line-height:1;text-align:right;color:var(--mute);transition:color .6s var(--ease)}
        .tl-stop.is-lit .tl-year{color:var(--ink)}
        .tl-card{display:block;padding:26px 28px;border-radius:26px;background:var(--card);box-shadow:var(--hair);transform:translateY(10px);transition:transform .9s var(--ease),box-shadow .6s var(--ease)}
        .tl-stop.is-lit .tl-card{transform:none;box-shadow:var(--hair),var(--lift)}
        .tl-meta{display:flex;flex-wrap:wrap;gap:10px;font-family:var(--font-mono);font-size:11.5px;letter-spacing:.04em;text-transform:uppercase;color:var(--mute)}
        .tl-meta span{color:var(--ink)}
        .tl-title{display:block;margin-top:10px;font-weight:700;font-size:clamp(22px,2.3vw,32px);letter-spacing:-.035em;line-height:1.08}
        .tl-place{margin-top:6px;font-size:14.5px;color:var(--mute)}
        .tl-detail{margin-top:14px;max-width:70ch;font-size:15px;line-height:1.6;color:var(--ink-2)}
        .tl-tech{display:flex;flex-wrap:wrap;gap:6px;margin:16px 0 0;padding:0;list-style:none}
        .tl-tech li{padding:4px 10px;border-radius:99px;box-shadow:inset 0 0 0 1px var(--line);font-size:12px;color:var(--ink-2)}
        .tl-more{margin-top:16px;border-top:1px solid var(--line)}
        .tl-more summary{display:flex;align-items:center;justify-content:space-between;padding-top:14px;cursor:pointer;list-style:none;font-size:13.5px;font-weight:500}
        .tl-more summary::-webkit-details-marker{display:none}
        .tl-more summary i{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);font-style:normal;transition:transform .5s var(--ease)}
        .tl-more[open] summary i{transform:rotate(45deg)}
        .tl-more ul{margin:12px 0 0;padding:0;list-style:none}
        .tl-more li{position:relative;padding:7px 0 7px 16px;font-size:14px;line-height:1.55;color:var(--ink-2)}
        .tl-more li::before{content:"";position:absolute;left:0;top:15px;width:6px;height:1.5px;background:var(--ink)}
        .tl-next{padding-bottom:0}
        .tl-card-next{background:transparent;box-shadow:none;border:1.5px dashed rgba(13,13,13,.28)}
        .tl-stop.is-lit .tl-card-next{box-shadow:none}
        .tl-card-next:hover{border-color:var(--ink)}
        .tl-next-cta{display:inline-flex;gap:8px;margin-top:14px;font-size:15px;font-weight:500}
        .tl-card-next:hover .tl-next-cta span{transform:translateX(4px)}
        .tl-next-cta span{transition:transform .5s var(--ease)}

        @media (max-width: 760px){
          .tl{--x:8px}
          .tl-stop{grid-template-columns:minmax(0,1fr);gap:10px;padding-left:36px}
          .tl-year{text-align:left;font-size:22px}
          .tl-dot{top:2px}
          .tl-card{padding:20px}
        }
      `}</style>
    </section>
  );
}
