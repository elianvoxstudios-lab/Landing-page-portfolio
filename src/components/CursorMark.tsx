"use client";

import { useEffect, useRef } from "react";

/**
 * The starburst sticker trails the mouse a little below-right of the pointer (the real cursor
 * stays). It springs after the pointer, tilts with horizontal speed, grows and spins over
 * links and buttons, squishes on click, and steps aside where something else owns the cursor
 * (the work wall's "Expand +" bubble, form fields). Mouse/trackpad only; off for reduced motion.
 */
const OFFSET = 18; // px below-right of the pointer tip
const FOLLOW = 0.2; // per 60fps frame
const INTERACTIVE = "a, button, [role='button'], label, select, summary";
const HIDE_OVER = ".wall, input, textarea, [contenteditable='true'], dialog[open]";

export default function CursorMark() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    let tx = -100, ty = -100, x = -100, y = -100, vx = 0;
    let tilt = 0, scale = 1, targetScale = 1, spin = 0, targetSpin = 0, offset = OFFSET;
    let visible = false, hidden = false, down = false, hot = false;
    let raf = 0, last = 0;

    const setOpacity = () => (el.style.opacity = visible && !hidden ? "1" : "0");
    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    };
    const step = (now: number) => {
      const f = Math.min(now - last, 100) / (1000 / 60);
      last = now;
      const k = 1 - Math.pow(1 - FOLLOW, f);
      const px = x;
      x += (tx - x) * k;
      y += (ty - y) * k;
      vx = (x - px) / Math.max(f, 0.001);
      tilt += (Math.max(-28, Math.min(28, vx * 1.6)) - tilt) * k;
      targetScale = down ? 0.82 : hot ? 1.4 : 1;
      scale += (targetScale - scale) * (1 - Math.pow(1 - 0.25, f));
      spin += (targetSpin - spin) * (1 - Math.pow(1 - 0.12, f));
      // grows away from the pointer so the larger mark sits beside a label rather than on it
      const off = OFFSET * Math.max(1, scale) * (hot ? 1.5 : 1);
      offset += (off - offset) * k;
      el.style.transform = `translate3d(${(x + offset).toFixed(1)}px, ${(y + offset).toFixed(1)}px, 0) rotate(${(tilt + spin).toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      const settled = Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1 && Math.abs(tilt) < 0.05 && Math.abs(targetScale - scale) < 0.002 && Math.abs(targetSpin - spin) < 0.05 && Math.abs(off - offset) < 0.1;
      raf = settled ? 0 : requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        x = tx; // appear at the pointer instead of flying in from the corner
        y = ty;
        visible = true;
      }
      const t = e.target as Element | null;
      hidden = !!t?.closest?.(HIDE_OVER);
      const nowHot = !!t?.closest?.(INTERACTIVE);
      if (nowHot && !hot) targetSpin += 90; // a quarter turn each time it lands on something clickable
      hot = nowHot;
      setOpacity();
      kick();
    };
    const onDown = () => { down = true; kick(); };
    const onUp = () => { down = false; kick(); };
    const onLeave = () => { visible = false; setOpacity(); };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="cursor-mark" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative sprite */}
      <img src="/brand/mark-sticker.png" alt="" width={389} height={420} draggable={false} />
    </div>
  );
}
