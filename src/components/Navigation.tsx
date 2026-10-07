"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { lockScroll } from "@/lib/scroll";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  // scroll state + progress bar
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 40);
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  // active section
  useEffect(() => {
    const targets = ["top", ...NAV.map((n) => n.id)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id === "top" ? null : e.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  const placePill = useCallback(() => {
    const ul = list.current;
    const p = pill.current;
    if (!ul || !p) return;
    const link = active ? ul.querySelector<HTMLElement>(`[data-id="${active}"]`) : null;
    if (!link) {
      p.style.opacity = "0";
      return;
    }
    p.style.opacity = "1";
    p.style.width = `${link.offsetWidth}px`;
    p.style.transform = `translateX(${link.offsetLeft}px)`;
  }, [active]);

  useIsoLayoutEffect(placePill, [placePill]);
  useEffect(() => {
    window.addEventListener("resize", placePill);
    document.fonts?.ready.then(placePill);
    return () => window.removeEventListener("resize", placePill);
  }, [placePill]);

  // mobile menu: lock scroll, Esc closes, focus management
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const btn = menuBtn.current;
    const t = setTimeout(() => firstLink.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
      btn?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <div className="nav-progress" aria-hidden="true">
        <div ref={bar} />
      </div>
      <header className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
        <a href="#top" className="nav-brand">
          <span className="nav-mark" aria-hidden="true">
            {PROFILE.initials}
          </span>
          <span className="nav-name">{PROFILE.name}</span>
          <span className="sr-only">, back to top</span>
        </a>

        <nav aria-label="Primary" className="nav-desk">
          <div ref={list} className="nav-pill">
            <span ref={pill} className="nav-indicator" aria-hidden="true" />
            <ul>
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  data-id={n.id}
                  className={active === n.id ? "is-active" : ""}
                  aria-current={active === n.id ? "location" : undefined}
                >
                  {n.label}
                </a>
              </li>
            ))}
            </ul>
          </div>
        </nav>

        <button
          ref={menuBtn}
          type="button"
          className="nav-menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <i aria-hidden="true" />
        </button>
      </header>

      <div
        id="mobile-menu"
        className={`nav-overlay ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
      >
        <nav aria-label="Mobile">
          <ol>
            {NAV.map((n, i) => (
              <li key={n.id} style={{ "--i": i } as React.CSSProperties}>
                <a ref={i === 0 ? firstLink : undefined} href={`#${n.id}`} onClick={() => setOpen(false)}>
                  <span className="nav-ov-idx">{String(i + 1).padStart(2, "0")}</span>
                  {n.label}
                </a>
              </li>
            ))}
          </ol>
          <p className="nav-ov-foot" style={{ "--i": NAV.length } as React.CSSProperties}>
            <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          </p>
        </nav>
      </div>

      <style href="nav" precedence="default">{`
        .nav-progress{position:fixed;inset:0 0 auto;height:2px;z-index:60;pointer-events:none}
        .nav-progress>div{height:100%;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;will-change:transform}

        .nav{position:fixed;z-index:50;top:14px;left:var(--gutter);right:var(--gutter);display:flex;align-items:center;justify-content:space-between;gap:16px;pointer-events:none}
        .nav>*{pointer-events:auto}
        .nav-brand{display:flex;align-items:center;gap:12px;border-radius:999px}
        .nav-mark{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--ink);font-family:var(--font-mono);font-size:13px;font-weight:600;letter-spacing:.02em;transition:background-color .5s var(--ease),color .5s var(--ease),transform .9s var(--ease)}
        .nav-brand:hover .nav-mark{transform:rotate(360deg)}
        .nav.is-scrolled .nav-mark,.nav.is-open .nav-mark{background:var(--ink);color:#fff}
        .nav-name{font-weight:600;font-size:15px;letter-spacing:-.02em;transition:opacity .5s var(--ease),transform .6s var(--ease)}
        .nav.is-scrolled .nav-name{opacity:0;transform:translateX(-8px);pointer-events:none}

        .nav-pill ul{display:flex;gap:2px;list-style:none;margin:0;padding:0}
        .nav-pill{position:relative;padding:5px;border-radius:999px;transition:background-color .5s var(--ease),box-shadow .5s var(--ease),backdrop-filter .5s}
        .nav.is-scrolled .nav-pill{background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:var(--hair),0 10px 30px -18px rgba(13,13,13,.25)}
        .nav-pill a{position:relative;z-index:1;display:block;padding:9px 16px;border-radius:999px;font-size:14px;font-weight:500;color:var(--ink-2);transition:color .45s var(--ease)}
        .nav-pill a:hover{color:var(--ink)}
        .nav-pill a.is-active{color:#fff}
        .nav-indicator{position:absolute;top:5px;bottom:5px;left:0;border-radius:999px;background:var(--ink);opacity:0;transition:transform .7s var(--ease),width .7s var(--ease),opacity .4s var(--ease)}

        .nav-menu-btn{display:none;align-items:center;gap:10px;height:44px;padding:0 18px;border-radius:999px;background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:var(--hair);font-size:14px;font-weight:500}
        .nav-menu-btn i{position:relative;width:14px;height:8px}
        .nav-menu-btn i::before,.nav-menu-btn i::after{content:"";position:absolute;left:0;right:0;height:1.5px;background:currentColor;transition:transform .5s var(--ease),top .5s var(--ease)}
        .nav-menu-btn i::before{top:0}.nav-menu-btn i::after{top:6.5px}
        .nav.is-open .nav-menu-btn{background:var(--ink);color:#fff}
        .nav.is-open .nav-menu-btn i::before{top:3.25px;transform:rotate(45deg)}
        .nav.is-open .nav-menu-btn i::after{top:3.25px;transform:rotate(-45deg)}

        .nav-overlay{position:fixed;inset:0;z-index:45;background:var(--paper);clip-path:inset(0 0 100% 0);transition:clip-path .8s var(--ease);display:flex;align-items:flex-end;padding:96px var(--gutter) 40px}
        .nav-overlay.is-open{clip-path:inset(0 0 0 0)}
        .nav-overlay nav{width:100%}
        .nav-overlay ol{list-style:none;margin:0;padding:0}
        .nav-overlay li,.nav-ov-foot{opacity:0;transform:translateY(40px);transition:opacity .6s var(--ease),transform .9s var(--ease)}
        .nav-overlay.is-open li,.nav-overlay.is-open .nav-ov-foot{opacity:1;transform:none;transition-delay:calc(180ms + var(--i) * 60ms)}
        .nav-overlay li a{display:flex;align-items:baseline;gap:16px;padding:6px 0;font-size:clamp(44px,13vw,88px);font-weight:700;letter-spacing:-.045em;line-height:1.02;border-bottom:1px solid var(--line)}
        .nav-ov-idx{font-family:var(--font-mono);font-size:12px;font-weight:400;letter-spacing:0;color:var(--mute);transform:translateY(-1.6em)}
        .nav-ov-foot{margin-top:28px;font-family:var(--font-mono);font-size:13px;color:var(--mute)}

        @media (max-width: 860px){
          .nav-desk{display:none}
          .nav-menu-btn{display:inline-flex}
        }
        @media (max-width: 400px){ .nav-name{font-size:14px} }
      `}</style>
    </>
  );
}
