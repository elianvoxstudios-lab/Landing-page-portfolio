import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import HomeClient, { type Featured, type WideFilm } from "./HomeClient";
import { INDUSTRIES } from "@/data/industries";
import { loadMedia } from "@/lib/media";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  // public/featured/<industry-slug>.<ext>, shown in industry order; files without a matching industry are skipped
  const media = loadMedia("featured");
  const featured: Featured[] = INDUSTRIES.flatMap((ind) => {
    const m = media.find((x) => x.file.replace(/\.[^.]+$/, "") === ind.slug);
    return m ? [{ slug: ind.slug, name: ind.name, src: m.src, alt: m.alt, kind: m.kind, width: m.width, height: m.height, poster: m.poster }] : [];
  });
  // Full-screen film above "The AI advantage": shown only once public/video/services-film.mp4 exists
  const vid = (f: string) => fs.existsSync(path.join(process.cwd(), "public/video", f));
  const wideFilm: WideFilm | null = vid("services-film.mp4")
    ? { src: "/video/services-film.mp4", poster: vid("services-film-poster.jpg") ? "/video/services-film-poster.jpg" : undefined }
    : null;
  return <HomeClient featured={featured} wideFilm={wideFilm} />;
}
