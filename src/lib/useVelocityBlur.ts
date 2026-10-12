"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { acquireLenis, releaseLenis } from "./smooth-scroll";

gsap.registerPlugin(SplitText);

/*
 * Scroll-velocity motion blur for display type.
 *
 * Add `motion-text` to any element and call useVelocityBlur() once on the page (the
 * <VelocityBlur /> component in the root layout already does). While the page is still the
 * text is untouched; when scrolling, each line smears vertically (one shared SVG blur on the
 * Y axis only), stretches and leans with the scroll, and eases back to sharp when it stops.
 *
 * Per element, optional:
 *   data-motion-lines=".ln"   use these existing children as the lines instead of splitting
 *   data-motion-split="none"  treat the whole element as one line (e.g. it is already animated)
 */

const FILTER_ID = "motion-blur";
const ACTIVE_CLASS = "motion-blur-on";
const LINE_CLASS = "motion-line";

const MAX_BLUR = 12; // px, Y axis only
const BLUR_PER_V = 0.35;
const STRETCH_PER_V = 0.004;
const MAX_STRETCH = 0.25;
const SKEW_PER_V = 0.08;
const MAX_SKEW = 6; // deg
const MIN_OPACITY = 0.85;
const FULL_SPEED = MAX_BLUR / BLUR_PER_V; // velocity at which blur and opacity max out
// Per-60fps-frame smoothing: quick to ramp in when scrolling starts, slower to let go,
// so text eases back to sharp over ~0.5s once the page stops instead of snapping
const ATTACK = 0.25;
const RELEASE = 0.085;
const STAGGER = 0.03; // s of lag per line inside a heading
const REST = 0.02; // below this velocity the line is left untouched

type Line = { el: HTMLElement; delay: number; v: number; moved: boolean };
type Target = { el: HTMLElement; lines: Line[]; visible: boolean; split?: SplitText };

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Shared <filter id="motion-blur">, created once and reused by every element. */
function ensureFilter(): SVGFEGaussianBlurElement {
  const existing = document.querySelector<SVGFEGaussianBlurElement>(`#${FILTER_ID} feGaussianBlur`);
  if (existing) return existing;
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  const filter = document.createElementNS(NS, "filter");
  filter.id = FILTER_ID;
  // Room for the vertical smear so it isn't clipped at the line box
  filter.setAttribute("x", "-5%");
  filter.setAttribute("y", "-60%");
  filter.setAttribute("width", "110%");
  filter.setAttribute("height", "220%");
  const blur = document.createElementNS(NS, "feGaussianBlur");
  blur.setAttribute("in", "SourceGraphic");
  blur.setAttribute("stdDeviation", "0 0");
  filter.appendChild(blur);
  svg.appendChild(filter);
  document.body.appendChild(svg);
  return blur;
}

/**
 * Attach the effect to every `selector` element on the page. Re-run by changing `key`
 * (e.g. the pathname) after the page's content changes.
 */
export function useVelocityBlur(selector = ".motion-text", key?: unknown) {
  useEffect(() => {
    const lenis = acquireLenis();
    if (!lenis) return; // reduced motion: no smooth scroll, no blur, no skew

    const blur = ensureFilter();
    const root = document.documentElement;
    const targets: Target[] = [];

    const setLines = (t: Target, els: HTMLElement[]) => {
      t.lines = els.map((el, i) => {
        el.classList.add(LINE_CLASS);
        return { el, delay: i * STAGGER, v: 0, moved: false };
      });
    };

    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      const t: Target = { el, lines: [], visible: false };
      const own = el.dataset.motionLines;
      if (own) setLines(t, [...el.querySelectorAll<HTMLElement>(own)]);
      else if (el.dataset.motionSplit === "none") setLines(t, [el]);
      else
        t.split = SplitText.create(el, {
          type: "lines",
          linesClass: LINE_CLASS,
          tag: "span",
          aria: "auto",
          autoSplit: true, // re-split on resize / font load so lines stay true
          onSplit: (self) => setLines(t, self.lines as HTMLElement[]),
        });
      targets.push(t);
    });

    // Only work on what's on screen
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        const t = targets.find((x) => x.el === e.target);
        if (t) t.visible = e.isIntersecting;
      }),
      { rootMargin: "20% 0px" }
    );
    targets.forEach((t) => io.observe(t.el));

    // Recent raw velocity, so each line can follow it with a small lag (the "wave")
    const history: { t: number; v: number }[] = [];
    const sampleAt = (time: number) => {
      for (let i = history.length - 1; i >= 0; i--) if (history[i].t <= time) return history[i].v;
      return history.length ? history[0].v : 0;
    };

    let smooth = 0;
    let lastBlur = -1;
    let on = false;

    const tick = (time: number, deltaMs: number) => {
      const frames = Math.min(deltaMs, 100) / (1000 / 60);
      const follow = (current: number, target: number) => {
        const rate = Math.abs(target) > Math.abs(current) ? ATTACK : RELEASE;
        return current + (target - current) * (1 - Math.pow(1 - rate, frames));
      };
      const raw = lenis.velocity || 0;
      history.push({ t: time, v: raw });
      while (history.length > 2 && time - history[0].t > 0.6) history.shift();

      // Shared blur follows the smoothed velocity
      smooth = follow(smooth, raw);
      if (Math.abs(smooth) < 0.005) smooth = 0;
      const y = clamp(Math.abs(smooth) * BLUR_PER_V, 0, MAX_BLUR);
      const blurOn = y > 0.05;
      if (blurOn !== on) {
        on = blurOn;
        root.classList.toggle(ACTIVE_CLASS, on);
      }
      const rounded = Math.round(y * 20) / 20;
      if (rounded !== lastBlur) {
        lastBlur = rounded;
        blur.setAttribute("stdDeviation", `0 ${rounded}`);
      }

      // Each line eases toward the velocity of a moment ago: transforms and opacity only
      for (const t of targets) {
        for (const line of t.lines) {
          if (!t.visible) {
            if (line.moved) {
              line.el.style.transform = line.el.style.opacity = "";
              line.moved = false;
              line.v = 0;
            }
            continue;
          }
          line.v = follow(line.v, sampleAt(time - line.delay));
          const a = Math.abs(line.v);
          if (a < REST) {
            if (line.moved) {
              line.el.style.transform = line.el.style.opacity = "";
              line.moved = false;
            }
            line.v = 0;
            continue;
          }
          const sy = 1 + Math.min(a * STRETCH_PER_V, MAX_STRETCH);
          const skew = clamp(line.v * SKEW_PER_V, -MAX_SKEW, MAX_SKEW);
          line.el.style.transform = `scaleY(${sy.toFixed(4)}) skewY(${skew.toFixed(3)}deg)`;
          line.el.style.opacity = (1 - (1 - MIN_OPACITY) * Math.min(a / FULL_SPEED, 1)).toFixed(3);
          line.moved = true;
        }
      }
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      root.classList.remove(ACTIVE_CLASS);
      blur.setAttribute("stdDeviation", "0 0");
      for (const t of targets) {
        for (const line of t.lines) {
          line.el.style.transform = line.el.style.opacity = "";
          if (!t.split) line.el.classList.remove(LINE_CLASS);
        }
        t.split?.revert();
      }
      releaseLenis();
    };
  }, [selector, key]);
}
