"use client";

import { useEffect } from "react";
import Link from "next/link";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { SERVICES } from "@/data/services";
import { INDUSTRIES } from "@/data/industries";
import MediaView from "@/components/MediaView";
import SiteFooter from "@/components/SiteFooter";

/** One featured piece per industry, read from public/featured/ by app/page.tsx. */
export type Featured = {
  slug: string;
  name: string;
  src: string;
  alt: string;
  kind: "image" | "video";
  width: number;
  height: number;
  poster?: string;
};

const EMAIL = "elianvoxstudios@gmail.com";

type Piece = {
  n: number;
  group: "photo" | "illus" | "render" | "brand";
  title: string;
  cat: string;
  file: string;
  w: number;
  h: number;
};

// Document order matters: it drives the CSS-columns masonry fill order.
const PIECES: Piece[] = [
  { n: 1, group: "photo", title: "Section 13", cat: "Editorial", file: "tile-n01-section-13.webp", w: 900, h: 1200 },
  { n: 19, group: "brand", title: "Morado cream", cat: "Brand identity", file: "tile-n19-morado-cream.jpg", w: 768, h: 1344 },
  { n: 3, group: "photo", title: "Crater I", cat: "Campaign", file: "tile-n03-crater-i.webp", w: 900, h: 1600 },
  { n: 9, group: "illus", title: "Open book", cat: "Illustration", file: "tile-n09-open-book.webp", w: 900, h: 1600 },
  { n: 20, group: "brand", title: "Bold flavor", cat: "Food campaign", file: "tile-n20-bold-flavor.jpg", w: 768, h: 1344 },
  { n: 6, group: "photo", title: "Blue hour I", cat: "Portrait", file: "tile-n06-blue-hour-i.webp", w: 900, h: 1600 },
  { n: 14, group: "render", title: "Pursuit", cat: "Anime key art", file: "tile-n14-pursuit.webp", w: 900, h: 1600 },
  { n: 21, group: "brand", title: "Spotlight energy", cat: "Beauty campaign", file: "tile-n21-spotlight-energy.jpg", w: 768, h: 1344 },
  { n: 8, group: "photo", title: "Serve", cat: "Conceptual", file: "tile-n08-serve.webp", w: 900, h: 1600 },
  { n: 16, group: "photo", title: "Red line", cat: "Editorial", file: "tile-n16-red-line.webp", w: 900, h: 1600 },
  { n: 22, group: "brand", title: "Street poster", cat: "Out of home", file: "tile-n22-street-poster.jpg", w: 768, h: 1344 },
  { n: 10, group: "illus", title: "Window", cat: "Illustration", file: "tile-n10-window.webp", w: 900, h: 1600 },
  { n: 4, group: "photo", title: "Crater II", cat: "Campaign", file: "tile-n04-crater-ii.webp", w: 900, h: 1600 },
  { n: 23, group: "brand", title: "Yuzu fizz", cat: "Product campaign", file: "tile-n23-yuzu-fizz.jpg", w: 768, h: 1344 },
  { n: 7, group: "photo", title: "Blue hour II", cat: "Portrait", file: "tile-n07-blue-hour-ii.webp", w: 900, h: 1600 },
  { n: 12, group: "illus", title: "Old master I", cat: "Illustration", file: "tile-n12-old-master-i.webp", w: 900, h: 1600 },
  { n: 24, group: "brand", title: "Edge key", cat: "Product visual", file: "tile-n24-edge-key.jpg", w: 1344, h: 768 },
  { n: 18, group: "photo", title: "Low tide", cat: "Film still", file: "tile-n18-low-tide.webp", w: 900, h: 1600 },
  { n: 11, group: "render", title: "Night shift", cat: "3D character", file: "tile-n11-night-shift.webp", w: 900, h: 1600 },
  { n: 26, group: "brand", title: "Gear drop", cat: "Brand illustration", file: "tile-n26-gear-drop.jpg", w: 768, h: 1344 },
  { n: 17, group: "photo", title: "Mirror room", cat: "Editorial", file: "tile-n17-mirror-room.webp", w: 900, h: 1600 },
  { n: 13, group: "illus", title: "Old master II", cat: "Illustration", file: "tile-n13-old-master-ii.webp", w: 900, h: 1600 },
  { n: 25, group: "brand", title: "Shortcuts", cat: "App campaign", file: "tile-n25-shortcuts.jpg", w: 1344, h: 768 },
  { n: 2, group: "photo", title: "Warm-up", cat: "Studio", file: "tile-n02-warm-up.webp", w: 900, h: 1200 },
  { n: 15, group: "illus", title: "Static", cat: "Illustration", file: "tile-n15-static.webp", w: 900, h: 1600 },
  { n: 27, group: "brand", title: "Market play", cat: "Brand illustration", file: "tile-n27-market-play.jpg", w: 752, h: 1344 },
  { n: 5, group: "photo", title: "Crater III", cat: "Campaign", file: "tile-n05-crater-iii.webp", w: 900, h: 1600 },
  { n: 28, group: "brand", title: "Tomato wall", cat: "Out of home", file: "tile-n28-tomato-wall.webp", w: 768, h: 1344 },
  { n: 29, group: "brand", title: "Locker fizz", cat: "Packaging", file: "tile-n29-locker-fizz.webp", w: 768, h: 1344 },
  { n: 30, group: "brand", title: "Your edge", cat: "Product render", file: "tile-n30-keycap.webp", w: 1344, h: 768 },
  { n: 31, group: "brand", title: "Gadget stand", cat: "Illustrated ad", file: "tile-n31-gadget-stand.webp", w: 768, h: 1344 },
];

const LANES = [
  { f: "all", label: "All work", count: "31" },
  { f: "brand", label: "Brand campaigns", count: "13" },
  { f: "photo", label: "Photographic campaigns", count: "11" },
  { f: "illus", label: "Illustration", count: "05" },
  { f: "render", label: "3D and anime", count: "02" },
];

const WHY = [
  {
    title: "Innovation at scale",
    desc: "Creative that adapts to live data: ads that shift colour or layout depending on who is watching.",
  },
  {
    title: "Faster workflows",
    desc: "Days of work done in hours, with dozens of variations ready for A/B testing at no extra cost.",
  },
  {
    title: "Lower cost",
    desc: "Fewer manual hours means more creative output for the same budget.",
  },
  {
    title: "Hyper-personalisation",
    desc: "Visuals shaped by how your audience actually engages, not one campaign for everyone.",
  },
  {
    title: "Consistent everywhere",
    desc: "One style and one brand voice across social ads, web banners and print.",
  },
  {
    title: "Built to scale",
    desc: "Global launches and large campaigns delivered without the usual bottlenecks.",
  },
];

export default function HomeClient({ featured }: { featured: Featured[] }) {
  useEffect(() => {
    const NS = "http://www.w3.org/2000/svg";
    const ROUTES = [
      { d: "M-40 66C140 70 200 196 300 222C350 235 390 242 418 244", start: 0.04 },
      { d: "M1416 70C1250 88 1150 198 1060 223C1010 236 970 242 938 244", start: 0.09 },
      { d: "M-40 172C120 188 182 262 300 268C350 270 386 268 408 268", start: 0.15 },
      { d: "M1416 262C1262 250 1180 286 1080 286C1030 285 990 281 956 279", start: 0.2 },
      { d: "M-40 398C110 392 200 332 300 319C350 312 386 308 412 306", start: 0.26 },
      { d: "M1416 512C1280 472 1150 342 1060 323C1010 314 976 310 950 308", start: 0.31 },
    ];
    const DRAW = 0.42;
    const PULSE: [number, number] = [0.8, 0.93];
    const SWEEP: [number, number] = [0.88, 0.99];

    const host = document.getElementById("cables");
    if (!host) return;
    host.innerHTML = "";

    const mk = (
      tag: string,
      attrs: Record<string, string | number>,
      parent?: Element
    ) => {
      const el = document.createElementNS(NS, tag);
      for (const k in attrs) el.setAttribute(k, String(attrs[k]));
      parent?.appendChild(el);
      return el;
    };

    const cables = ROUTES.map((r, i) => {
      const g = mk("g", {}, host);
      const mask = mk("mask", { id: "m" + i, maskUnits: "userSpaceOnUse", x: -100, y: -100, width: 1600, height: 1000 }, g);
      const reveal = mk("path", { d: r.d, fill: "none", stroke: "#fff", "stroke-width": 24, "stroke-linecap": "butt" }, mask) as SVGPathElement;
      const body = mk("g", { mask: `url(#m${i})` }, g);
      mk("path", { d: r.d, fill: "none", stroke: "#23282c", "stroke-width": 8.5, "stroke-linecap": "round" }, body);
      mk("path", { d: r.d, fill: "none", stroke: "#8c969c", "stroke-width": 5.5 }, body);
      mk("path", { d: r.d, fill: "none", stroke: "#3b4247", "stroke-width": 5.5, "stroke-dasharray": "1.4 2.2", opacity: 0.55 }, body);
      mk("path", { d: r.d, fill: "none", stroke: "#f2f5f6", "stroke-width": 1.3, opacity: 0.8, transform: "translate(0 -1.4)" }, body);
      const pulse = mk("path", { d: r.d, fill: "none", stroke: "#ffffff", "stroke-width": 4, "stroke-linecap": "round", filter: "url(#glow)", opacity: 0 }, g) as SVGPathElement;
      const plug = mk("use", { href: "#plug" }, g) as SVGUseElement;
      const spark = mk("circle", { r: 26, fill: "url(#spark)", opacity: 0 }, g) as SVGCircleElement;
      const len = reveal.getTotalLength();
      const end = reveal.getPointAtLength(len);
      spark.setAttribute("cx", String(end.x));
      spark.setAttribute("cy", String(end.y));
      reveal.setAttribute("stroke-dasharray", `${len} ${len + 10}`);
      pulse.setAttribute("stroke-dasharray", `70 ${len + 200}`);
      return { ...r, reveal, pulse, plug, spark, len };
    });

    const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const range = (t: number, [a, b]: [number, number]) => clamp((t - a) / (b - a));
    const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

    const scene = document.getElementById("scene")!;
    const photo = document.getElementById("photo") as HTMLImageElement;
    const hint = document.getElementById("hint")!;
    const heroCopy = document.getElementById("heroCopy") as HTMLElement;
    const sweepBar = document.getElementById("sweepBar")!;

    function render(t: number) {
      const settle = easeOut(clamp(t / 0.8));
      const x = (1 - settle) * -2.2,
        s = 1.07 - settle * 0.07;
      photo.style.transform = `translateX(${x}%) scale(${s})`;
      photo.style.filter = `brightness(${0.86 + settle * 0.14})`;
      hint.style.opacity = String(1 - range(t, [0, 0.06]));

      const pulseT = range(t, PULSE);
      for (const c of cables) {
        const p = ease(range(t, [c.start, c.start + DRAW]));
        const at = c.len * p;
        c.reveal.setAttribute("stroke-dashoffset", String(c.len - Math.max(0, at - 30)));
        const a = c.reveal.getPointAtLength(Math.max(0, at - 2));
        const b = c.reveal.getPointAtLength(Math.max(2, at));
        const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
        c.plug.setAttribute("transform", `translate(${b.x} ${b.y}) rotate(${ang})`);
        (c.plug as unknown as HTMLElement).style.opacity = p > 0 ? "1" : "0";
        const landed = range(t, [c.start + DRAW, c.start + DRAW + 0.07]);
        c.spark.setAttribute("opacity", String(landed > 0 && landed < 1 ? Math.sin(landed * Math.PI) : 0));
        c.pulse.setAttribute("stroke-dashoffset", String(70 - pulseT * (c.len + 70)));
        c.pulse.setAttribute("opacity", String(pulseT > 0 && pulseT < 1 ? 1 : 0));
      }

      const sw = range(t, SWEEP);
      sweepBar.setAttribute("x", String(380 + sw * 760));
      sweepBar.setAttribute("opacity", String(sw > 0 && sw < 1 ? Math.sin(sw * Math.PI) : 0));

      // Headline and CTAs greet on load, then clear out as the cables plug in
      const hc = reduce.matches ? 1 : 1 - range(t, [0.18, 0.32]);
      heroCopy.style.opacity = String(hc);
      heroCopy.style.visibility = hc > 0 ? "visible" : "hidden";
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let ticking = false;
    function progress() {
      const r = scene.getBoundingClientRect();
      const span = scene.offsetHeight - window.innerHeight;
      return clamp(-r.top / span);
    }
    function update() {
      ticking = false;
      render(reduce.matches ? 1 : progress());
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduce.addEventListener?.("change", update);
    if (reduce.matches) (hint as HTMLElement).style.display = "none";
    update();

    // ===== Showcase wall =====
    type Item = { n: number; g: string; title: string; cat: string; alt: string; src: string };
    const DATA: Item[] = PIECES.map((p) => ({
      n: p.n, g: p.group, title: p.title, cat: p.cat,
      alt: `${p.title}, ${p.cat.toLowerCase()}`, src: `/images/${p.file}`,
    }));
    const wall = document.getElementById("wall")!;
    const expand = document.getElementById("expand")!;
    let current = DATA;
    let swapTimer = 0;

    // Each column loops on its own: it drifts automatically, and the wheel/trackpad scrolls just
    // the column under the pointer. The track holds its tiles twice, so wrapping by one copy is seamless.
    type Lane = { col: HTMLElement; track: HTMLElement; pos: number; speed: number; pending: number; loop: number };
    let laneState: Lane[] = [];
    let hoverCol: HTMLElement | null = null;
    const laneRo = new ResizeObserver(() => laneState.forEach(measureLane));
    function measureLane(l: Lane) {
      const gap = parseFloat(getComputedStyle(l.track).rowGap) || 0;
      l.loop = (l.track.offsetHeight + gap) / 2;
    }

    function tileEl(d: Item, dup: boolean) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tile2";
      b.dataset.n = String(d.n);
      if (dup) {
        b.tabIndex = -1;
        b.setAttribute("aria-hidden", "true");
      } else b.setAttribute("aria-label", "Expand " + d.title);
      const img = document.createElement("img");
      img.src = d.src;
      img.alt = dup ? "" : d.alt;
      img.decoding = "async";
      const cap = document.createElement("span");
      cap.className = "cap";
      const t = document.createElement("span");
      t.textContent = d.title;
      const k = document.createElement("span");
      k.textContent = d.cat;
      cap.append(t, k);
      b.append(img, cap);
      return b;
    }

    function buildWall(items: Item[]) {
      wall.innerHTML = "";
      const cols = 3;
      let pool = [...items];
      while (pool.length < 18) pool = pool.concat(items);
      const speeds = [78, 96, 70];
      for (let ci = 0; ci < cols; ci++) {
        const col = document.createElement("div");
        col.className = "col" + (ci % 2 ? " down" : "");
        const shift = document.createElement("div");
        shift.className = "col-shift";
        const track = document.createElement("div");
        track.className = "track";
        const mine = pool.filter((_, j) => j % cols === ci);
        track.dataset.dur = String((speeds[ci] * mine.length) / 6);
        mine.forEach((d) => track.appendChild(tileEl(d, false)));
        mine.forEach((d) => track.appendChild(tileEl(d, true)));
        shift.appendChild(track);
        col.appendChild(shift);
        wall.appendChild(col);
      }
      laneRo.disconnect();
      laneState = [...wall.querySelectorAll<HTMLElement>(".col")].map((col) => {
        const track = col.querySelector<HTMLElement>(".track")!;
        const l: Lane = { col, track, pos: 0, speed: 0, pending: 0, loop: 0 };
        measureLane(l);
        // seconds per loop -> px per second; odd columns drift downward
        l.speed = (col.classList.contains("down") ? 1 : -1) / Number(track.dataset.dur);
        if (col.classList.contains("down")) l.pos = -l.loop;
        laneRo.observe(track);
        return l;
      });
    }
    buildWall(DATA);

    const lanes = [...document.querySelectorAll<HTMLButtonElement>(".lanes button")];
    lanes.forEach((b) => {
      b.onclick = () => {
        if (b.getAttribute("aria-pressed") === "true") return;
        lanes.forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
        current = b.dataset.f === "all" ? DATA : DATA.filter((d) => d.g === b.dataset.f);
        wall.classList.add("swap");
        window.clearTimeout(swapTimer);
        swapTimer = window.setTimeout(() => {
          buildWall(current);
          wall.classList.remove("swap");
        }, 350);
      };
    });

    // "Expand +" bubble follows the pointer over the wall
    let cx = -300, cy = -300, tx = -300, ty = -300, rafId = 0;
    function follow() {
      cx += (tx - cx) * 0.25;
      cy += (ty - cy) * 0.25;
      expand.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      rafId = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.3 ? requestAnimationFrame(follow) : 0;
    }
    const setOver = (on: boolean) => expand.classList.toggle("on", on);

    const RM_WALL = reduce.matches; // reduced motion: no drift, the wall scrolls natively (see CSS)
    let laneRaf = 0, laneLast = 0, wallVisible = false;
    function stepLanes(now: number) {
      const dt = Math.min(0.05, (now - (laneLast || now)) / 1000);
      laneLast = now;
      for (const l of laneState) {
        if (!l.loop) continue;
        const auto = l.col === hoverCol || RM_WALL ? 0 : l.speed * l.loop * dt;
        const manual = l.pending * 0.18;
        l.pending -= manual;
        if (Math.abs(l.pending) < 0.1) l.pending = 0;
        l.pos += auto - manual;
        l.pos = ((l.pos % l.loop) - l.loop) % l.loop; // keep in (-loop, 0]
        l.track.style.transform = `translate3d(0, ${l.pos.toFixed(2)}px, 0)`;
      }
      laneRaf = wallVisible ? requestAnimationFrame(stepLanes) : 0;
    }
    const wallIo = new IntersectionObserver(([e]) => {
      wallVisible = e.isIntersecting;
      if (wallVisible && !laneRaf) { laneLast = 0; laneRaf = requestAnimationFrame(stepLanes); }
    });
    wallIo.observe(wall);
    const onWallWheel = (e: WheelEvent) => {
      const col = (e.target as HTMLElement).closest<HTMLElement>(".col");
      const l = col && laneState.find((x) => x.col === col);
      if (!l) return;
      e.preventDefault();
      l.pending += e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
    };
    if (!RM_WALL) wall.addEventListener("wheel", onWallWheel, { passive: false });
    const onWallMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      hoverCol = (e.target as HTMLElement).closest<HTMLElement>(".col");
      const over = !!(e.target as HTMLElement).closest(".tile2");
      tx = e.clientX;
      ty = e.clientY;
      if (over && !expand.classList.contains("on")) { cx = tx; cy = ty; }
      setOver(over);
      if (!rafId) rafId = requestAnimationFrame(follow);
    };
    const onWallLeave = () => {
      hoverCol = null;
      setOver(false);
    };
    wall.addEventListener("pointermove", onWallMove);
    wall.addEventListener("pointerleave", onWallLeave);

    // Lightbox
    const lb = document.getElementById("lb") as HTMLDialogElement;
    const lbImg = document.getElementById("lbImg") as HTMLImageElement;
    const lbTitle = document.getElementById("lbTitle")!;
    const lbCount = document.getElementById("lbCount")!;
    let list: Item[] = [];
    let idx = 0;
    function show(i: number) {
      idx = (i + list.length) % list.length;
      const d = list[idx];
      lbImg.src = d.src;
      lbImg.alt = d.alt;
      lbTitle.textContent = d.title + ", " + d.cat;
      lbCount.textContent = idx + 1 + " / " + list.length;
    }
    function openAt(n: number) {
      list = current;
      show(Math.max(0, list.findIndex((d) => d.n === n)));
      setOver(false);
      lb.showModal();
    }
    const onWallClick = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>(".tile2");
      if (t) openAt(Number(t.dataset.n));
    };
    wall.addEventListener("click", onWallClick);
    (document.getElementById("openAll") as HTMLButtonElement).onclick = () => openAt(current[0].n);
    (document.getElementById("lbClose") as HTMLButtonElement).onclick = () => lb.close();
    (document.getElementById("lbPrev") as HTMLButtonElement).onclick = () => show(idx - 1);
    (document.getElementById("lbNext") as HTMLButtonElement).onclick = () => show(idx + 1);
    const onLbBackdrop = (e: MouseEvent) => {
      if (e.target === lb || (e.target as HTMLElement).classList.contains("lb-inner")) lb.close();
    };
    lb.addEventListener("click", onLbBackdrop);
    const onLbKeydown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") show(idx + 1);
      if (e.key === "ArrowLeft") show(idx - 1);
    };
    lb.addEventListener("keydown", onLbKeydown);
    let sx: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      sx = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      sx = null;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    };
    lb.addEventListener("touchstart", onTouchStart, { passive: true });
    lb.addEventListener("touchend", onTouchEnd);

    // Launch film: muted loop in the hero, full film with sound in a dialog
    const launch = document.getElementById("launch") as HTMLButtonElement;
    const launchPreview = document.getElementById("launchPreview") as HTMLVideoElement;
    const film = document.getElementById("film") as HTMLDialogElement;
    const filmVideo = document.getElementById("filmVideo") as HTMLVideoElement;
    const playPreview = () => {
      if (reduce.matches) return;
      launchPreview.muted = true;
      launchPreview.play().catch(() => {});
    };
    playPreview();
    launch.onclick = () => {
      launchPreview.pause();
      film.showModal();
      filmVideo.currentTime = 0;
      filmVideo.muted = false;
      filmVideo.play().catch(() => {});
    };
    (document.getElementById("filmClose") as HTMLButtonElement).onclick = () => film.close();
    const onFilmBackdrop = (e: MouseEvent) => {
      if (e.target === film || (e.target as HTMLElement).classList.contains("lb-inner")) film.close();
    };
    film.addEventListener("click", onFilmBackdrop);
    const onFilmClose = () => {
      filmVideo.pause();
      playPreview();
    };
    film.addEventListener("close", onFilmClose);

    // ===== Everything below the hero =====
    const RM = reduce.matches;
    const vh = () => window.innerHeight;

    const st = document.getElementById("statement")!;
    st.innerHTML = st.textContent!.trim().split(/\s+/).map((w) => `<span class="w">${w}</span> `).join("");
    const words = [...st.querySelectorAll<HTMLElement>(".w")];

    const reel = document.getElementById("reel")!;
    const track = document.getElementById("reelTrack") as HTMLElement;
    const reelBar = document.getElementById("reelBar") as HTMLElement;
    const reelCount = document.getElementById("reelCount")!;
    const cards = [...track.children] as HTMLElement[];
    let travel = 0;
    function sizeReel() {
      if (RM) return;
      travel = Math.max(0, track.scrollWidth - window.innerWidth);
      reel.style.height = travel + vh() + "px";
    }

    const contactEl = document.getElementById("contact")!;
    const contactIo = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) contactEl.classList.add("in");
      },
      { threshold: 0.2 }
    );
    contactIo.observe(contactEl);

    const bands = [...document.querySelectorAll<HTMLElement>(".band-row")];
    const talk = document.getElementById("talk")!;
    const showEl = document.getElementById("work")!;

    function below() {
      if (RM) return;
      const H = vh();
      const r = st.getBoundingClientRect();
      const p = clamp((H * 0.8 - r.top) / (r.height + H * 0.3));
      const lit = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("on", i < lit));

      const rr = reel.getBoundingClientRect();
      const rp = travel ? clamp(-rr.top / travel) : 0;
      track.style.transform = `translate3d(${-rp * travel}px,0,0)`;
      reelBar.style.transform = `scaleX(${rp})`;
      const active = Math.min(cards.length - 1, Math.round(rp * (cards.length - 1)));
      reelCount.textContent = String(active + 1).padStart(2, "0") + " / " + String(cards.length).padStart(2, "0");
      if (rr.bottom > 0 && rr.top < H) {
        const W = window.innerWidth;
        cards.forEach((c) => {
          const b = c.getBoundingClientRect();
          const off = (b.left + b.width / 2 - W / 2) / W;
          c.querySelector<HTMLElement>("img, video")!.style.setProperty("--px", (-off * 60).toFixed(1) + "px");
        });
      }

      const y = window.scrollY;
      bands.forEach((b) => {
        const half = b.scrollWidth / 2;
        const d = Number(b.dataset.dir);
        const x = (y * 0.35) % half;
        b.style.transform = `translate3d(${d < 0 ? -x : x - half}px,0,0)`;
      });

      const sr = showEl.getBoundingClientRect();
      if (sr.bottom > 0 && sr.top < H) {
        const off = sr.top + sr.height / 2 - H / 2;
        wall.querySelectorAll<HTMLElement>(".col-shift").forEach((col, i) => {
          col.style.transform = `translate3d(0, ${(off * [0.12, -0.08, 0.16][i]).toFixed(1)}px, 0)`;
        });
      }

      const past = scene.getBoundingClientRect().bottom < H * 0.2;
      const cr = contactEl.getBoundingClientRect();
      talk.classList.toggle("visible", past && cr.top > H * 0.7);
    }

    let t2 = false;
    const onScroll2 = () => {
      if (!t2) {
        t2 = true;
        requestAnimationFrame(() => {
          t2 = false;
          below();
        });
      }
    };
    const onResize2 = () => {
      sizeReel();
      below();
    };
    const toHash = () => {
      if (window.location.hash.length > 1) document.querySelector(window.location.hash)?.scrollIntoView();
    };
    const onLoad2 = () => {
      sizeReel();
      below();
      toHash();
    };
    window.addEventListener("scroll", onScroll2, { passive: true });
    window.addEventListener("resize", onResize2);
    window.addEventListener("load", onLoad2);
    sizeReel();
    below();
    toHash();
    if (RM) {
      words.forEach((w) => w.classList.add("on"));
      contactEl.classList.add("in");
    }

    // Contact form
    const mailLink = document.getElementById("mailLink") as HTMLAnchorElement;
    mailLink.textContent = EMAIL;
    mailLink.href = "mailto:" + EMAIL;
    const copyBtn = document.getElementById("copyMail") as HTMLButtonElement;
    copyBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(EMAIL);
        copyBtn.textContent = "Copied";
      } catch {
        copyBtn.textContent = "Select and copy above";
      }
      setTimeout(() => (copyBtn.textContent = "Copy email"), 1800);
    };
    const needBtns = [...document.querySelectorAll<HTMLButtonElement>("#needs button")];
    needBtns.forEach((b) => {
      b.onclick = () => b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true");
    });

    const form = document.getElementById("form") as HTMLFormElement;
    const industrySel = form.elements.namedItem("industry") as HTMLSelectElement;
    // ?service=<slug>&industry=<slug> pre-fills the form (Enquire links, industry page CTAs)
    const preselect = (search: string) => {
      const q = new URLSearchParams(search);
      const svc = q.get("service");
      const ind = q.get("industry");
      if (svc) needBtns.forEach((b) => b.dataset.slug === svc && b.setAttribute("aria-pressed", "true"));
      if (ind && [...industrySel.options].some((o) => o.value === ind)) industrySel.value = ind;
    };
    preselect(window.location.search);
    // Enquire links on this page: pre-select and scroll without reloading
    const onEnquire = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[data-enquire]");
      if (!a) return;
      const url = new URL(a.href);
      if (url.pathname !== window.location.pathname) return;
      e.preventDefault();
      preselect(url.search);
      history.replaceState(null, "", url.search + url.hash);
      contactEl.scrollIntoView({ behavior: RM ? "auto" : "smooth" });
    };
    document.addEventListener("click", onEnquire);
    const sendBtn = form.querySelector<HTMLButtonElement>(".send")!;
    const note = document.getElementById("formNote")!;
    form.onsubmit = async (e) => {
      e.preventDefault();
      const err = document.getElementById("formErr")!;
      const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
      const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
      const msg = (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim();
      if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
        err.textContent = "Add your name and a valid email so Elian can reply.";
        return;
      }
      err.textContent = "";
      const picked = needBtns.filter((b) => b.getAttribute("aria-pressed") === "true").map((b) => b.textContent || "");
      const industry = industrySel.value ? industrySel.selectedOptions[0].text : "";
      // Industry rides along in the needs list so the enquiries table needs no new column
      const needs = industry ? [...picked, `Industry: ${industry}`] : picked;

      const done = () => {
        form.reset();
        document.querySelectorAll("#needs button").forEach((b) => b.setAttribute("aria-pressed", "false"));
        sendBtn.textContent = "Sent";
        note.className = "ok";
        note.textContent = "Thanks " + name.split(" ")[0] + ", your message is in. Elian will get back to you soon.";
        setTimeout(() => {
          sendBtn.textContent = "Send message";
          sendBtn.disabled = false;
        }, 4000);
      };
      const fallback = () => {
        const subject = `Project enquiry from ${name}`;
        const body = `Name: ${name}\nEmail: ${email}\nIndustry: ${industry || "Not specified"}\nLooking for: ${picked.join(", ") || "Not specified"}\n\n${msg}`;
        window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      };

      const company = (form.elements.namedItem("company") as HTMLInputElement).value;
      if (company) {
        done();
        return;
      } // honeypot: pretend it worked for bots
      if (!supabaseConfigured || !supabase) {
        fallback();
        return;
      }

      sendBtn.disabled = true;
      sendBtn.textContent = "Sending...";
      try {
        const { error } = await supabase.from("enquiries").insert({ name, email, needs, message: msg });
        if (error) throw error;
        done();
      } catch {
        sendBtn.disabled = false;
        sendBtn.textContent = "Send message";
        err.textContent = "That didn't go through. Try again, or email " + EMAIL + " directly.";
      }
    };

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onEnquire);
      window.removeEventListener("resize", onScroll);
      reduce.removeEventListener?.("change", update);
      window.removeEventListener("scroll", onScroll2);
      window.removeEventListener("resize", onResize2);
      window.removeEventListener("load", onLoad2);
      lb.removeEventListener("click", onLbBackdrop);
      lb.removeEventListener("keydown", onLbKeydown);
      lb.removeEventListener("touchstart", onTouchStart);
      lb.removeEventListener("touchend", onTouchEnd);
      film.removeEventListener("click", onFilmBackdrop);
      film.removeEventListener("close", onFilmClose);
      window.clearTimeout(swapTimer);
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(laneRaf);
      wallIo.disconnect();
      laneRo.disconnect();
      wall.removeEventListener("wheel", onWallWheel);
      wall.removeEventListener("pointermove", onWallMove);
      wall.removeEventListener("pointerleave", onWallLeave);
      wall.removeEventListener("click", onWallClick);
      contactIo.disconnect();
      host.innerHTML = "";
    };
  }, []);

  return (
    <>
      <section className="scene" id="scene">
        <div className="stage">
          <div className="frame">
            <img
              id="photo"
              src="/images/hero-photo.webp"
              alt="Portrait of a man in mirrored wraparound glasses with cables plugging into the temples"
            />
            <svg id="rig" viewBox="0 0 1376 768" aria-hidden="true">
              <defs>
                <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f4f6f7" />
                  <stop offset=".35" stopColor="#9aa3a9" />
                  <stop offset=".55" stopColor="#3a4046" />
                  <stop offset=".8" stopColor="#b9c1c6" />
                  <stop offset="1" stopColor="#4b5258" />
                </linearGradient>
                <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#fff" stopOpacity="0" />
                  <stop offset=".5" stopColor="#fff" stopOpacity=".95" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <radialGradient id="spark">
                  <stop offset="0" stopColor="#fff" stopOpacity="1" />
                  <stop offset=".4" stopColor="#e8f3ff" stopOpacity=".7" />
                  <stop offset="1" stopColor="#e8f3ff" stopOpacity="0" />
                </radialGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <clipPath id="lenses">
                  <path d="M428 252C428 190 468 178 560 180C640 182 660 196 680 196C700 196 722 182 800 180C888 178 932 190 932 252C932 332 906 392 840 392C764 392 732 332 692 288C684 280 676 280 668 288C628 332 598 392 520 392C454 392 428 332 428 252Z" />
                </clipPath>
                <g id="plug">
                  <rect x="-66" y="-7.5" width="44" height="15" rx="3" fill="url(#chrome)" stroke="#1d2226" strokeWidth=".8" />
                  <path d="M-58 -7.5v15M-54 -7.5v15M-50 -7.5v15M-46 -7.5v15" stroke="#2a3035" strokeWidth="1.1" opacity=".55" />
                  <rect x="-22" y="-6" width="11" height="12" rx="1.5" fill="#23282c" />
                  <rect x="-11" y="-3.2" width="11" height="6.4" rx="1" fill="url(#chrome)" stroke="#1d2226" strokeWidth=".6" />
                </g>
              </defs>
              <g id="cables"></g>
              <g id="sweepLayer" clipPath="url(#lenses)" style={{ mixBlendMode: "screen" }}>
                <rect id="sweepBar" x="-120" y="150" width="120" height="280" fill="url(#sweep)" transform="skewX(-18)" opacity="0" />
              </g>
            </svg>
          </div>

          <div className="bar">
            <span className="mark">Elian Vox</span>
            <nav>
              <a href="#work">Work</a>
              <a href="#services">Services</a>
              <Link href="/industries">Industries</Link>
              <a href="#contact">Contact</a>
            </nav>
          </div>

          <div className="hint" id="hint">
            <span>Scroll to connect</span>
            <i></i>
          </div>

          <div className="hero-copy" id="heroCopy">
            <h1>
              <span className="h1-brand">Elian Vox</span>
              <span className="h1-line">
                AI-Powered <em>Creative</em> &amp; Social Media <em>Studio</em>
              </span>
            </h1>
            <p className="hero-tag">Campaigns, content and social systems that make brands impossible to ignore.</p>
            <div className="hero-ctas">
              <a className="intro-cta" href="#contact">
                Start a project <span aria-hidden="true">&rarr;</span>
              </a>
              <a className="ghost-cta" href="#reel">
                See our work
              </a>
            </div>
          </div>

          <button type="button" className="launch" id="launch" aria-label="Play the Elian Vox launch film with sound">
            <video
              id="launchPreview"
              src="/video/launch-film-preview.mp4"
              poster="/video/launch-film-poster.jpg"
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
            />
            <span className="launch-tag">New</span>
            <span className="launch-cap">
              <span className="launch-play" aria-hidden="true"></span>
              <span>
                <b>Launch film</b>
                <small>0:20, sound on</small>
              </span>
            </span>
          </button>
        </div>
      </section>

      <section className="statement" id="about" aria-labelledby="about-title">
        <div className="intro-top">
          <div>
            <p className="kicker">
              <i aria-hidden="true"></i>AI creative studio
            </p>
            <h2 id="about-title">
              Redefining <em>creativity</em> with AI
            </h2>
          </div>
          <svg className="badge" viewBox="0 0 120 120" aria-hidden="true">
            <defs>
              <path id="badgePath" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" />
            </defs>
            <g className="badge-ring">
              <text fontSize="9.5" letterSpacing="1.2">
                <textPath href="#badgePath" textLength="286" lengthAdjust="spacing">
                  AI-POWERED CREATIVE STUDIO &#8226; ELIAN VOX &#8226;
                </textPath>
              </text>
            </g>
            <path className="badge-arrow" d="M60 44V76M48 64L60 76L72 64" />
          </svg>
        </div>
        <p className="lead" id="statement">
          A studio that offers AI-powered creative solutions for brands and agencies, streamlining production
          timelines and enhancing creative flexibility.
        </p>
        <div className="intro-cols">
          <p>Extend your in-house team with AI-powered production that delivers anything you can imagine.</p>
          <p>
            Great ideas shouldn&apos;t be held back by time or budget. We combine creative strategy with cutting-edge
            AI to bring bold concepts to life. Whether it&apos;s a brand film, a product launch or content at scale,
            we make it impossible to ignore.
          </p>
        </div>
        <div className="intro-foot">
          <ul className="chips">
            <li>Brand films</li>
            <li>Product launches</li>
            <li>Content at scale</li>
          </ul>
          <a className="intro-cta" href="#contact">
            Start a project <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </section>

      <section className="why" id="why" aria-labelledby="why-title">
        <div className="why-head">
          <div>
            <p className="why-eyebrow">Why choose us</p>
            <h2 id="why-title">
              The <em>AI</em> advantage
            </h2>
          </div>
          <p>
            Choosing an AI creative design agency in 2026 is not just a technical decision. It is a strategic one,
            and it gives the brands who make it a real edge.
          </p>
        </div>
        <ol className="why-grid">
          {WHY.map((w, i) => (
            <li key={w.title}>
              <span className="no">{String(i + 1).padStart(2, "0")}</span>
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="reel" id="reel" aria-label="Featured work">
        <div className="reel-stage">
          <div className="reel-head">
            <h2>Featured work</h2>
            <span className="reel-count" id="reelCount">
              01 / {String(featured.length).padStart(2, "0")}
            </span>
          </div>
          <div className="reel-scroll">
            <div className="reel-track" id="reelTrack">
              {featured.map((f, i) => (
                <figure className="card" key={f.slug}>
                  <Link className="card-link" href={`/industries/${f.slug}`}>
                    <div className="win">
                      <MediaView src={f.src} alt={f.alt} kind={f.kind} width={f.width} height={f.height} poster={f.poster} />
                    </div>
                    <figcaption>
                      <span className="n">{String(i + 1).padStart(2, "0")}</span>
                      <b>{f.name}</b>
                      <span className="c">
                        View industry <span aria-hidden="true">&rarr;</span>
                      </span>
                    </figcaption>
                  </Link>
                </figure>
              ))}
            </div>
          </div>
          <div className="reel-bar">
            <i id="reelBar"></i>
          </div>
        </div>
      </section>

      <div className="band" aria-hidden="true">
        <div className="band-row" data-dir="-1">
          <span>Campaigns</span>
          <span>Editorials</span>
          <span>Characters</span>
          <span>Motion</span>
          <span>Campaigns</span>
          <span>Editorials</span>
          <span>Characters</span>
          <span>Motion</span>
        </div>
        <div className="band-row" data-dir="1">
          <span>Still to motion</span>
          <span>Frame by frame</span>
          <span>Still to motion</span>
          <span>Frame by frame</span>
          <span>Still to motion</span>
          <span>Frame by frame</span>
        </div>
      </div>

      <section className="show" id="work" aria-label="Selected work">
        <div className="show-copy">
          <p className="eyebrow">Selected work</p>
          <h2>
            Every frame <em>is built</em> to <em>move</em>
          </h2>
          <p className="lede">
            Campaign visuals, editorial series and characters, made with AI and finished by hand. Pick a lane or
            take in the whole wall.
          </p>
          <ul className="lanes" role="list">
            {LANES.map((l) => (
              <li key={l.f}>
                <button type="button" data-f={l.f} aria-pressed={l.f === "all"}>
                  <span>{l.label}</span>
                  <span className="k">{l.count}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="show-cta">
            <a className="btn" href="#contact">
              Start a project
            </a>
            <button type="button" className="btn ghost" id="openAll">
              Browse full screen
            </button>
          </div>
        </div>
        <div className="wall" id="wall" aria-label="Work, click any piece to expand"></div>
        <div className="expand" id="expand" aria-hidden="true">
          <span>Expand +</span>
        </div>
      </section>

      <section className="services" id="services" aria-label="Services">
        <div className="services-head">
          <h2>
            What we <em>make</em>
          </h2>
          <p>
            One studio for the image and the motion. Start with a single piece or hand us the whole campaign, from
            first reference to final export.
          </p>
        </div>
        <ol className="svc">
          {SERVICES.map((s, i) => (
            <li key={s.slug}>
              <span className="no">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{s.title}</h3>
                <p className="sub">{s.sub}</p>
              </div>
              <div className="body">
                <p className="desc">{s.desc}</p>
                <ul className="tags">
                  {s.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <a className="enquire" data-enquire href={`/?service=${s.slug}#contact`}>
                  Enquire <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </li>
          ))}
        </ol>
        <div className="services-cta">
          <p>Not sure which fits? Tell us what it is for and we will shape the brief with you.</p>
          <a href="#contact">Start a project</a>
        </div>
      </section>

      <section className="ind-teaser" aria-labelledby="ind-teaser-title">
        <div className="ind-teaser-head">
          <h2 id="ind-teaser-title">
            Built for <em>your</em> industry
          </h2>
          <Link href="/industries">All industries &rarr;</Link>
        </div>
        <ul>
          {INDUSTRIES.map((ind) => (
            <li key={ind.slug}>
              <Link href={`/industries/${ind.slug}`} title={ind.line}>
                {ind.name} <span aria-hidden="true">&rarr;</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="contact" id="contact">
        <h2>
          <span className="ln">
            <span>Let&apos;s make</span>
          </span>
          <span className="ln">
            <span>something move.</span>
          </span>
        </h2>
        <div className="contact-grid">
          <form className="form" id="form" noValidate>
            <div className="row">
              <label>
                Your name
                <input name="name" autoComplete="name" required />
              </label>
              <label>
                Your email
                <input name="email" type="email" autoComplete="email" required />
              </label>
            </div>
            <label>
              Your industry
              <select name="industry" defaultValue="">
                <option value="">Choose one (optional)</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind.slug} value={ind.slug}>
                    {ind.name}
                  </option>
                ))}
                <option value="other">Something else</option>
              </select>
            </label>
            <fieldset>
              <legend>What do you need?</legend>
              <div className="needs" id="needs">
                {SERVICES.map((sv) => (
                  <button key={sv.slug} type="button" aria-pressed="false" data-slug={sv.slug}>
                    {sv.title}
                  </button>
                ))}
                <button type="button" aria-pressed="false">
                  Something else
                </button>
              </div>
            </fieldset>
            <label>
              Tell me about the project
              <textarea name="message" placeholder="What it's for, rough timeline, any references"></textarea>
            </label>
            <label className="hp" aria-hidden="true">
              Company
              <input name="company" tabIndex={-1} autoComplete="off" />
            </label>
            <div className="err" id="formErr" role="alert"></div>
            <button className="send" type="submit">
              Send message
            </button>
            <small id="formNote">Replies usually come straight to your inbox.</small>
          </form>
          <div className="direct">
            <h3>Or reach out directly</h3>
            <div className="mail">
              <a id="mailLink" href="#"></a>
              <button type="button" id="copyMail">
                Copy email
              </button>
            </div>
            <ul className="socials">
              <li>
                <a href="https://instagram.com/elianvox.ai" target="_blank" rel="noopener">
                  <span>Instagram</span>
                  <span>@elianvox.ai</span>
                </a>
              </li>
              <li>
                <a href="https://www.behance.net/elianvox" target="_blank" rel="noopener">
                  <span>Behance</span>
                  <span>elianvox</span>
                </a>
              </li>
              <li>
                <a href="https://x.com/elianvoxx" target="_blank" rel="noopener">
                  <span>X</span>
                  <span>@elianvoxx</span>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/elianvox" target="_blank" rel="noopener">
                  <span>LinkedIn</span>
                  <span>Elian Vox</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <SiteFooter />
      <a className="talk" id="talk" href="#contact">
        Let&apos;s talk
      </a>

      <dialog className="lb" id="lb" aria-label="Image viewer">
        <div className="lb-top">
          <span id="lbTitle"></span>
          <button type="button" id="lbClose">
            Close
          </button>
        </div>
        <div className="lb-inner">
          <img id="lbImg" alt="" />
        </div>
        <div className="lb-bottom">
          <button type="button" id="lbPrev">
            Previous
          </button>
          <span className="count" id="lbCount"></span>
          <button type="button" id="lbNext">
            Next
          </button>
        </div>
      </dialog>

      <dialog className="lb film" id="film" aria-label="Launch film">
        <div className="lb-top">
          <span>Elian Vox, launch film</span>
          <button type="button" id="filmClose">
            Close
          </button>
        </div>
        <div className="lb-inner">
          <video id="filmVideo" src="/video/launch-film.mp4" poster="/video/launch-film-poster.jpg" controls playsInline preload="none" />
        </div>
      </dialog>
    </>
  );
}
