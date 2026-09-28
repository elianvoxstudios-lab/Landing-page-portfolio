// Server-only: uses the filesystem at build time.
import fs from "node:fs";
import path from "node:path";

// Reads a public/ asset folder and its captions.md at build time.
// captions.md lines look like `- filename.ext: caption`; the list order is the gallery order,
// the caption is the alt text. Videos use a same-name .jpg/.webp/.png next to them as poster.

export type Media = {
  src: string;
  file: string;
  alt: string;
  kind: "image" | "video";
  width: number;
  height: number;
  poster?: string;
};

const PUBLIC = path.join(process.cwd(), "public");
const IMAGE = /\.(webp|jpe?g|png|avif)$/i;
const VIDEO = /\.(mp4|webm|mov)$/i;

function imageSize(file: string): [number, number] {
  try {
    const b = fs.readFileSync(file);
    if (b.toString("ascii", 0, 4) === "RIFF") {
      const fmt = b.toString("ascii", 12, 16);
      if (fmt === "VP8X") return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
      if (fmt === "VP8 ") return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
      if (fmt === "VP8L") {
        const n = b.readUInt32LE(21);
        return [(n & 0x3fff) + 1, ((n >> 14) & 0x3fff) + 1];
      }
    }
    if (b.readUInt32BE(0) === 0x89504e47) return [b.readUInt32BE(16), b.readUInt32BE(20)];
    if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length) {
        const marker = b[i + 1];
        const len = b.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc)
          return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
        i += 2 + len;
      }
    }
  } catch {}
  return [9, 16];
}

function readCaptions(dir: string): Map<string, string> {
  const map = new Map<string, string>();
  const md = path.join(dir, "captions.md");
  if (!fs.existsSync(md)) return map;
  for (const line of fs.readFileSync(md, "utf8").split("\n")) {
    const m = line.match(/^\s*[-*]\s*`?([^`:]+?)`?\s*:\s*(.+)$/);
    if (m) map.set(m[1].trim(), m[2].trim());
  }
  return map;
}

/** All media in public/<folder>, captioned files first in captions.md order. */
export function loadMedia(folder: string): Media[] {
  const dir = path.join(PUBLIC, folder);
  if (!fs.existsSync(dir)) return [];
  const captions = readCaptions(dir);
  const files = fs.readdirSync(dir).filter((f) => IMAGE.test(f) || VIDEO.test(f));
  const posters = new Set(
    files.filter((f) => IMAGE.test(f) && files.some((v) => VIDEO.test(v) && v.replace(VIDEO, "") === f.replace(IMAGE, "")))
  );
  const order = [...captions.keys()];
  const main = files
    .filter((f) => !posters.has(f))
    .sort((a, b) => {
      const ia = order.indexOf(a), ib = order.indexOf(b);
      return (ia < 0 ? 1e9 : ia) - (ib < 0 ? 1e9 : ib) || a.localeCompare(b);
    });
  return main.map((file) => {
    const src = `/${folder}/${file}`;
    const alt = captions.get(file) ?? file.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
    if (VIDEO.test(file)) {
      const poster = [...posters].find((p) => p.replace(IMAGE, "") === file.replace(VIDEO, ""));
      const [width, height] = poster ? imageSize(path.join(dir, poster)) : [9, 16];
      return { src, file, alt, kind: "video" as const, width, height, poster: poster ? `/${folder}/${poster}` : undefined };
    }
    const [width, height] = imageSize(path.join(dir, file));
    return { src, file, alt, kind: "image" as const, width, height };
  });
}

export const industryMedia = (slug: string) => loadMedia(`industries/${slug}`);

/** Cover image for an industry: the named cover, else the first image or video poster. */
export function industryCover(slug: string, cover?: string): Media | undefined {
  const media = industryMedia(slug);
  return (cover && media.find((m) => m.file === cover)) || media.find((m) => m.kind === "image" || m.poster);
}
