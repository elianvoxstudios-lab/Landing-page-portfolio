import type { Metadata } from "next";
import HomeClient, { type Featured } from "./HomeClient";
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
  return <HomeClient featured={featured} />;
}
