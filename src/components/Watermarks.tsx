"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Turns the big starburst watermark behind every `[data-watermark]` section as it scrolls past.
 * Writes one non-inheriting custom property (--wm-rot) per visible section, once per frame
 * while scrolling. Static with prefers-reduced-motion.
 */
export default function Watermarks() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = [...document.querySelectorAll<HTMLElement>("[data-watermark]")];
    if (!els.length) return;
    const visible = new Set<HTMLElement>();
    const io = new IntersectionObserver((entries) =>
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target as HTMLElement) : visible.delete(e.target as HTMLElement)))
    );
    els.forEach((el) => io.observe(el));

    let raf = 0;
    const update = () => {
      raf = 0;
      visible.forEach((el) => {
        const r = el.getBoundingClientRect();
        // about a quarter turn while the section crosses the screen
        el.style.setProperty("--wm-rot", `${(-(r.top + r.height / 2 - innerHeight / 2) * 0.05).toFixed(2)}deg`);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
