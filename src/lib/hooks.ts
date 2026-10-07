"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type InViewOptions = { threshold?: number | number[]; rootMargin?: string; once?: boolean };

export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { threshold = 0, rootMargin = "0px", once = false }: InViewOptions = {},
): boolean {
  const [inView, setInView] = useState(false);
  const key = Array.isArray(threshold) ? threshold.join(",") : String(threshold);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) io.disconnect();
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, key, rootMargin, once]);

  return inView;
}

/**
 * Calls `onProgress` with 0…1 as the element travels through the viewport:
 * 0 when its top reaches `anchor` (fraction of viewport height), 1 when its bottom does.
 * Runs at most once per frame and only while the element is near the viewport.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onProgress: (p: number) => void,
  anchor = 0.6,
): void {
  const cb = useRef(onProgress);
  useEffect(() => {
    cb.current = onProgress;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let near = false;

    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const line = window.innerHeight * anchor;
      const p = (line - r.top) / Math.max(1, r.height);
      cb.current(Math.min(1, Math.max(0, p)));
    };
    const schedule = () => {
      if (near && !raf) raf = requestAnimationFrame(measure);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        near = e.isIntersecting;
        if (near) schedule();
      },
      { rootMargin: "50% 0px 50% 0px" },
    );
    io.observe(el);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, anchor]);
}

/** Matches a media query; false on the server and first client render. */
export function useMedia(query: string): boolean {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}
