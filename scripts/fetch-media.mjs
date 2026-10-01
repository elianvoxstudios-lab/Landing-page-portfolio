// Downloads the launch film and new portfolio tiles into public/ before `next build`.
// Every file is checked against its expected byte size. On Vercel a missing or wrong-sized
// file fails the build, so the current production deployment stays live instead of shipping
// a broken video card. Locally it only warns, so builds still work offline.
// Files already present at the right size are skipped (e.g. if they get committed later).

import fs from "node:fs";
import path from "node:path";

const BASE = "https://d2ol7oe51mr4n9.cloudfront.net/user_36WxUSeVk7hMjXTiDh8zXuMvQbW";
const FILES = [
  ["public/video/launch-film.mp4", "6bb6df39-bbae-4e14-962b-e475983bbafa.mp4", 4600232],
  ["public/video/launch-film-preview.mp4", "9e5d9479-2505-4ea9-9e50-7334c9af1298.mp4", 1089148],
  ["public/video/launch-film-poster.jpg", "a5985868-b7ee-480d-a2f7-788acbaec799.jpg", 28305],
  ["public/images/tile-n28-tomato-wall.webp", "e166ab41-f671-48a9-ac7c-758007d51cee.webp", 216680],
  ["public/images/tile-n29-locker-fizz.webp", "33cf31b4-9186-409b-ae86-8faba073835a.webp", 125136],
  ["public/images/tile-n30-keycap.webp", "02ccce25-242d-4dbc-b8a1-1df7cb24a6c2.webp", 104930],
  ["public/images/tile-n31-gadget-stand.webp", "62818bc8-2046-4182-ba9f-8b0fdd60179a.webp", 93892],
];

const strict = !!process.env.VERCEL;
const problems = [];

for (const [dest, id, bytes] of FILES) {
  const file = path.join(process.cwd(), dest);
  if (fs.existsSync(file) && fs.statSync(file).size === bytes) {
    console.log(`media: ok (present) ${dest}`);
    continue;
  }
  try {
    const res = await fetch(`${BASE}/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length !== bytes) throw new Error(`got ${buf.length} bytes, expected ${bytes}`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, buf);
    console.log(`media: ok (downloaded) ${dest} ${bytes} bytes`);
  } catch (e) {
    problems.push(`${dest}: ${e.message}`);
  }
}

if (problems.length) {
  const msg = `media: ${problems.length} file(s) failed:\n  ${problems.join("\n  ")}`;
  if (strict) {
    console.error(msg + "\nFailing the build so the current deployment stays live.");
    process.exit(1);
  }
  console.warn(msg + "\n(local build: continuing without them)");
}
