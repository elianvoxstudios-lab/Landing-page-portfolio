import Lenis from "lenis";
import { gsap } from "gsap";

// One Lenis instance for the whole site, driven by GSAP's ticker so smooth scrolling and
// anything reading `lenis.velocity` run on the same frame. Reference-counted so several
// hooks can share it; skipped entirely when the viewer prefers reduced motion.

let lenis: Lenis | null = null;
let users = 0;
const raf = (time: number) => lenis?.raf(time * 1000);

export function acquireLenis(): Lenis | null {
  if (typeof window === "undefined") return null;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  if (!lenis) {
    lenis = new Lenis({ lerp: 0.08, autoRaf: false, anchors: true });
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
  }
  users++;
  return lenis;
}

export function releaseLenis() {
  if (!lenis || --users > 0) return;
  gsap.ticker.remove(raf);
  lenis.destroy();
  lenis = null;
}
