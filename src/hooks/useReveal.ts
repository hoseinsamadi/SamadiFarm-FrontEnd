import { useEffect, useRef, useState } from "react";

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
export function toFa(input: string | number): string { return String(input).replace(/\d/g, (d) => FA_DIGITS[Number(d)]); }
export function formatToman(n: number): string { try { return new Intl.NumberFormat("fa-IR").format(n); } catch { return toFa(n.toLocaleString("en-US")); } }
export function prefersReducedMotion(): boolean { return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(".reveal, .reveal-lines");
    if (!("IntersectionObserver" in window)) { targets.forEach((el) => el.classList.add("is-visible")); return; }
    const io = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); } }); }, { threshold: .14, rootMargin: "0px 0px -6% 0px" });
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, deps);
}
export function useScrolled(threshold = 10): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > threshold); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, [threshold]);
  return scrolled;
}
export function scrollToId(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }
export function useCountUp(target: number, duration = 1400) {
  const ref = useRef<HTMLElement | null>(null); const [value, setValue] = useState(0); const started = useRef(false);
  useEffect(() => { const el = ref.current; if (!el) return; if (prefersReducedMotion()) { setValue(target); return; }
    const io = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting || started.current) return; started.current = true; const t0 = performance.now(); const tick = (now: number) => { const p = Math.min((now - t0) / duration, 1); setValue(Math.round(target * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); io.disconnect(); }, { threshold: .4 });
    io.observe(el); return () => io.disconnect();
  }, [target, duration]);
  return { ref, value };
}
