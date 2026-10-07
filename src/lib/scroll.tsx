"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { prefersReducedMotion } from "./hooks";

let lenis: Lenis | null = null;

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Sections use `content-visibility: auto`, so unvisited ones only have estimated heights.
 * Lay everything out once so targets are measured at their real positions;
 * `contain-intrinsic-size: auto` keeps those sizes after the class is removed.
 */
function settleLayout(): void {
  const root = document.documentElement;
  if (root.dataset.settled) return;
  root.classList.add("cv-off");
  void root.offsetHeight;
  root.dataset.settled = "1";
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("cv-off")));
}

export function scrollToTarget(target: string | number | HTMLElement, { focus = true } = {}): void {
  settleLayout();
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : typeof target === "number" ? null : target;
  const done = () => {
    if (focus && el) el.focus({ preventScroll: true });
  };

  if (lenis) {
    lenis.scrollTo(el ?? (target as number), { duration: 1.4, easing: easeOutExpo, onComplete: done });
    return;
  }
  const top = el ? el.getBoundingClientRect().top + window.scrollY : (target as number);
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  done();
}

export function lockScroll(locked: boolean): void {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/** Mounts Lenis (unless reduced motion) and routes every in-page `#anchor` link through it. */
export function SmoothScroll() {
  useEffect(() => {
    if (!prefersReducedMotion()) {
      lenis = new Lenis({ autoRaf: true, lerp: 0.1, smoothWheel: true });
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href^='#']");
      if (!a) return;
      const hash = a.getAttribute("href")!;
      const el = hash === "#" || hash === "#top" ? document.getElementById("top") : document.querySelector<HTMLElement>(hash);
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el);
      history.replaceState(null, "", hash === "#top" ? location.pathname : hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
