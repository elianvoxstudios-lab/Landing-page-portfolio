"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  alt: string;
  kind: "image" | "video";
  width: number;
  height: number;
  poster?: string;
  className?: string;
  /** Load eagerly (above-the-fold hero). */
  priority?: boolean;
};

/** Lazy image, or a muted looping video that only plays while on screen. */
export default function MediaView({ src, alt, kind, width, height, poster, className, priority }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "200px" }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  if (kind === "video")
    return (
      <video
        ref={ref}
        className={className}
        src={src}
        poster={poster}
        width={width}
        height={height}
        muted
        loop
        playsInline
        preload="none"
        aria-label={alt}
      />
    );

  return (
    // eslint-disable-next-line @next/next/no-img-element -- matches the rest of the site's plain <img> usage
    <img
      className={className}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}
