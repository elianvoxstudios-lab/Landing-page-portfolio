"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Contained 16:9 brand intro under "Redefining creativity with AI".
 * Plays muted while on screen, pauses off screen; viewers can turn sound on.
 * With reduced motion it waits on its poster until the viewer presses play.
 */
export default function IntroFilm({ src, poster, label }: { src: string; poster?: string; label: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = video.current, w = wrap.current;
    if (!v || !w) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.4 });
    io.observe(w);
    return () => io.disconnect();
  }, []);

  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setSound(!v.muted);
    if (!v.muted) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };
  const togglePlay = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <div ref={wrap} className="intro-film">
      <video
        ref={video}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div className="if-controls">
        <button type="button" onClick={togglePlay} aria-label={playing ? "Pause film" : "Play film"}>
          {playing ? "Pause" : "Play"}
        </button>
        <button type="button" onClick={toggleSound} aria-pressed={sound}>
          {sound ? "Sound off" : "Sound on"}
        </button>
      </div>
    </div>
  );
}
