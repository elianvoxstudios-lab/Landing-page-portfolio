"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Mode = "fit" | "fill";
const KEY = "ev-wide-film";

// The viewer's choice lives in localStorage; this tiny store lets React read it without a
// setState-in-effect, and renders the CSS defaults on the server.
type Prefs = { mode?: Mode; min?: boolean };
const EVT = "ev-wide-film-change";
const read = () => {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
};
const subscribe = (cb: () => void) => {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
};
const write = (p: Prefs) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
  window.dispatchEvent(new Event(EVT));
};
const parse = (raw: string): Prefs => {
  try {
    const p = JSON.parse(raw || "{}");
    return { mode: p.mode === "fit" || p.mode === "fill" ? p.mode : undefined, min: !!p.min };
  } catch {
    return {};
  }
};

/**
 * Full-width film with viewer controls: Fit (whole 16:9 frame, no crop) or Fill (edge to edge),
 * sound, full screen and minimize. Default is Fill on landscape screens and Fit on portrait
 * ones (via CSS); a viewer's choice is remembered on their device.
 */
export default function WideFilm({ src, poster, label }: { src: string; poster?: string; label: string }) {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const prefs = parse(useSyncExternalStore(subscribe, read, () => ""));
  const mode = prefs.mode ?? null;
  const min = !!prefs.min;
  const [sound, setSound] = useState(false);
  const save = (next: Prefs) => write({ ...prefs, ...next });

  // Play only while on screen and not minimized
  useEffect(() => {
    const v = video.current, s = section.current;
    if (!v || !s) return;
    if (min) {
      v.pause();
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.25 });
    io.observe(s);
    return () => io.disconnect();
  }, [min]);

  // Current effective mode (CSS default when the viewer hasn't chosen)
  const effective = (): Mode => mode ?? (window.matchMedia("(max-aspect-ratio: 1/1)").matches ? "fit" : "fill");
  const toggleMode = () => {
    const next: Mode = effective() === "fit" ? "fill" : "fit";
    save({ mode: next });
  };
  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setSound(!v.muted);
    if (v.paused) v.play().catch(() => {});
  };
  const fullscreen = () => {
    const v = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen().catch(() => v.webkitEnterFullscreen?.());
    else v.webkitEnterFullscreen?.();
  };
  const setMinimized = (m: boolean) => {
    save({ min: m });
    if (!m) requestAnimationFrame(() => section.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
  };

  return (
    <section ref={section} className="wide-film" data-mode={mode ?? undefined} data-min={min || undefined} aria-label={label}>
      <div className="wf-stage" hidden={min}>
        <video ref={video} src={src} poster={poster} muted loop playsInline preload="metadata" aria-label={label} />
        <div className="wf-controls">
          <button type="button" onClick={toggleMode} aria-label="Switch between fit and fill">
            <span className="wf-fit">Fit</span>
            <span className="wf-fill">Fill</span>
          </button>
          <button type="button" onClick={toggleSound} aria-pressed={sound}>
            {sound ? "Sound off" : "Sound on"}
          </button>
          <button type="button" onClick={fullscreen}>Full screen</button>
          <button type="button" onClick={() => setMinimized(true)}>Minimize</button>
        </div>
      </div>
      {min && (
        <div className="wf-bar">
          <span>{label}</span>
          <button type="button" onClick={() => setMinimized(false)}>
            Show film
          </button>
        </div>
      )}
    </section>
  );
}
