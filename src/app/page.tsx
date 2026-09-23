"use client";

import { useEffect } from "react";
import { supabase, supabaseConfigured } from "@/lib/supabase";

const EMAIL = "hello@example.com"; // change this to the real address

type Piece = {
  n: number;
  group: "photo" | "illus" | "render";
  title: string;
  cat: string;
  file: string;
  w: number;
  h: number;
};

// Document order matters: it drives the CSS-columns masonry fill order.
const PIECES: Piece[] = [
  { n: 1, group: "photo", title: "Section 13", cat: "Editorial", file: "tile-n01-section-13.webp", w: 900, h: 1200 },
  { n: 3, group: "photo", title: "Crater I", cat: "Campaign", file: "tile-n03-crater-i.webp", w: 900, h: 1600 },
  { n: 9, group: "illus", title: "Open book", cat: "Illustration", file: "tile-n09-open-book.webp", w: 900, h: 1600 },
  { n: 6, group: "photo", title: "Blue hour I", cat: "Portrait", file: "tile-n06-blue-hour-i.webp", w: 900, h: 1600 },
  { n: 14, group: "render", title: "Pursuit", cat: "Anime key art", file: "tile-n14-pursuit.webp", w: 900, h: 1600 },
  { n: 8, group: "photo", title: "Serve", cat: "Conceptual", file: "tile-n08-serve.webp", w: 900, h: 1600 },
  { n: 16, group: "photo", title: "Red line", cat: "Editorial", file: "tile-n16-red-line.webp", w: 900, h: 1600 },
  { n: 10, group: "illus", title: "Window", cat: "Illustration", file: "tile-n10-window.webp", w: 900, h: 1600 },
  { n: 4, group: "photo", title: "Crater II", cat: "Campaign", file: "tile-n04-crater-ii.webp", w: 900, h: 1600 },
  { n: 7, group: "photo", title: "Blue hour II", cat: "Portrait", file: "tile-n07-blue-hour-ii.webp", w: 900, h: 1600 },
  { n: 12, group: "illus", title: "Old master I", cat: "Illustration", file: "tile-n12-old-master-i.webp", w: 900, h: 1600 },
  { n: 18, group: "photo", title: "Low tide", cat: "Film still", file: "tile-n18-low-tide.webp", w: 900, h: 1600 },
  { n: 11, group: "render", title: "Night shift", cat: "3D character", file: "tile-n11-night-shift.webp", w: 900, h: 1600 },
  { n: 17, group: "photo", title: "Mirror room", cat: "Editorial", file: "tile-n17-mirror-room.webp", w: 900, h: 1600 },
  { n: 13, group: "illus", title: "Old master II", cat: "Illustration", file: "tile-n13-old-master-ii.webp", w: 900, h: 1600 },
  { n: 2, group: "photo", title: "Warm-up", cat: "Studio", file: "tile-n02-warm-up.webp", w: 900, h: 1200 },
  { n: 15, group: "illus", title: "Static", cat: "Illustration", file: "tile-n15-static.webp", w: 900, h: 1600 },
  { n: 5, group: "photo", title: "Crater III", cat: "Campaign", file: "tile-n05-crater-iii.webp", w: 900, h: 1600 },
];

const REEL: { from: number; n: string; title: string; cat: string }[] = [
  { from: 1, n: "01", title: "Section 13", cat: "Editorial" },
  { from: 4, n: "02", title: "Crater II", cat: "Campaign" },
  { from: 6, n: "03", title: "Blue hour I", cat: "Portrait" },
  { from: 14, n: "04", title: "Pursuit", cat: "Anime key art" },
  { from: 16, n: "05", title: "Red line", cat: "Editorial" },
  { from: 11, n: "06", title: "Night shift", cat: "3D character" },
  { from: 18, n: "07", title: "Low tide", cat: "Film still" },
];

const FILTERS = [
  { f: "all", label: "All", count: 18 },
  { f: "photo", label: "Photographic", count: 11 },
  { f: "illus", label: "Illustration", count: 5 },
  { f: "render", label: "3D and anime", count: 2 },
];

export default function Home() {
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
    const TITLE: [number, number] = [0.86, 0.98];

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
    const title = document.getElementById("title") as HTMLElement;
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

      const tt = easeOut(range(t, TITLE));
      title.style.opacity = String(tt);
      title.style.transform = `translateY(${(1 - tt) * 24}px)`;
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

    // Filters
    const figsAll = [...document.querySelectorAll<HTMLElement>(".piece")];
    const btns = [...document.querySelectorAll<HTMLButtonElement>(".filters button")];
    btns.forEach((b) => {
      b.onclick = () => {
        btns.forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
        const f = b.dataset.f;
        figsAll.forEach((fig) => {
          fig.hidden = !(f === "all" || fig.dataset.group === f);
        });
      };
    });

    // Lightbox
    const lb = document.getElementById("lb") as HTMLDialogElement;
    const lbImg = document.getElementById("lbImg") as HTMLImageElement;
    const lbTitle = document.getElementById("lbTitle")!;
    const lbCount = document.getElementById("lbCount")!;
    let list: HTMLElement[] = [];
    let idx = 0;
    function show(i: number) {
      idx = (i + list.length) % list.length;
      const fig = list[idx];
      const img = fig.querySelector("img")!;
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      const spans = fig.querySelectorAll("figcaption span");
      const name = spans[0];
      const cat = spans[1];
      lbTitle.textContent = name.textContent + ", " + cat.textContent;
      lbCount.textContent = idx + 1 + " / " + list.length;
    }
    figsAll.forEach((fig) => {
      const tile = fig.querySelector("button.tile") as HTMLButtonElement;
      tile.onclick = () => {
        list = figsAll.filter((f) => !f.hidden);
        show(list.indexOf(fig));
        lb.showModal();
      };
    });
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

    // ===== Everything below the hero =====
    const RM = reduce.matches;
    const vh = () => window.innerHeight;

    const st = document.getElementById("statement")!;
    st.innerHTML = st.textContent!.trim().split(/\s+/).map((w) => `<span class="w">${w}</span> `).join("");
    const words = [...st.querySelectorAll<HTMLElement>(".w")];

    document.querySelectorAll<HTMLImageElement>("[data-from]").forEach((img) => {
      const src = document.querySelector<HTMLImageElement>(`.piece img[data-n="${img.dataset.from}"]`);
      if (src) img.src = src.src;
    });
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

    const io = new IntersectionObserver(
      (entries) => {
        let k = 0;
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.transitionDelay = "0s";
            const f = e.target as HTMLElement;
            setTimeout(() => f.classList.add("in"), (k++ % 3) * 90);
            io.unobserve(f);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    figsAll.forEach((f) => (RM ? f.classList.add("in") : io.observe(f)));

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
    const gridImgs = [...document.querySelectorAll<HTMLImageElement>(".piece img")];

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
          c.querySelector<HTMLElement>("img")!.style.setProperty("--px", (-off * 60).toFixed(1) + "px");
        });
      }

      const y = window.scrollY;
      bands.forEach((b) => {
        const half = b.scrollWidth / 2;
        const d = Number(b.dataset.dir);
        const x = (y * 0.35) % half;
        b.style.transform = `translate3d(${d < 0 ? -x : x - half}px,0,0)`;
      });

      gridImgs.forEach((img) => {
        const b = (img.parentNode as HTMLElement).getBoundingClientRect();
        if (b.bottom < -50 || b.top > H + 50) return;
        const off = (b.top + b.height / 2 - H / 2) / H;
        img.style.setProperty("--py", (off * -38).toFixed(1) + "px");
      });

      const past = scene.getBoundingClientRect().bottom < H * 0.2;
      const cr = contactEl.getBoundingClientRect();
      talk.classList.toggle("show", past && cr.top > H * 0.7);
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
    const onLoad2 = () => {
      sizeReel();
      below();
    };
    window.addEventListener("scroll", onScroll2, { passive: true });
    window.addEventListener("resize", onResize2);
    window.addEventListener("load", onLoad2);
    sizeReel();
    below();
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
    document.querySelectorAll<HTMLButtonElement>("#needs button").forEach((b) => {
      b.onclick = () => b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true");
    });

    const form = document.getElementById("form") as HTMLFormElement;
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
      const needs = [...document.querySelectorAll('#needs button[aria-pressed="true"]')].map((b) => b.textContent || "");

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
        const body = `Name: ${name}\nEmail: ${email}\nLooking for: ${needs.join(", ") || "Not specified"}\n\n${msg}`;
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
      window.removeEventListener("resize", onScroll);
      reduce.removeEventListener?.("change", update);
      window.removeEventListener("scroll", onScroll2);
      window.removeEventListener("resize", onResize2);
      window.removeEventListener("load", onLoad2);
      lb.removeEventListener("click", onLbBackdrop);
      lb.removeEventListener("keydown", onLbKeydown);
      lb.removeEventListener("touchstart", onTouchStart);
      lb.removeEventListener("touchend", onTouchEnd);
      io.disconnect();
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
              &nbsp;&nbsp;&nbsp;
              <a href="#contact">Contact</a>
            </nav>
          </div>

          <div className="hint" id="hint">
            <span>Scroll to connect</span>
            <i></i>
          </div>

          <div className="title" id="title">
            <h1>
              Elian
              <br />
              Vox
            </h1>
            <p>Motion and image design for campaigns, editorials and characters.</p>
          </div>
        </div>
      </section>

      <section className="statement" aria-label="About">
        <p id="statement">
          Elian Vox makes images that feel like they are about to move. Campaigns, editorials and characters, built
          frame by frame and ready for motion.
        </p>
      </section>

      <section className="reel" id="reel" aria-label="Featured work">
        <div className="reel-stage">
          <div className="reel-head">
            <h2>Featured</h2>
            <span className="reel-count" id="reelCount">
              01 / 07
            </span>
          </div>
          <div className="reel-scroll">
            <div className="reel-track" id="reelTrack">
              {REEL.map((c) => (
                <figure className="card" key={c.from}>
                  <div className="win">
                    <img data-from={c.from} alt={`${c.title}, ${c.cat.toLowerCase()}`} />
                  </div>
                  <figcaption>
                    <span className="n">{c.n}</span>
                    <b>{c.title}</b>
                    <span className="c">{c.cat}</span>
                  </figcaption>
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

      <section className="work" id="work">
        <div className="work-head">
          <h2>Selected work</h2>
          <p>
            Photographic campaigns, flat illustration and 3D characters. Every frame is built to move, so most of
            these exist as motion pieces too.
          </p>
        </div>
        <div className="filters" role="group" aria-label="Filter work">
          {FILTERS.map((f) => (
            <button key={f.f} type="button" data-f={f.f} aria-pressed={f.f === "all"}>
              {f.label}
              <span>{f.count}</span>
            </button>
          ))}
        </div>
        <div className="grid" id="grid">
          {PIECES.map((p) => (
            <figure className="piece" data-group={p.group} key={p.n}>
              <button className="tile" type="button" aria-label={`Open ${p.title}`}>
                <span className="ph">
                  <img
                    data-n={p.n}
                    src={`/images/${p.file}`}
                    width={p.w}
                    height={p.h}
                    alt={`${p.title}, ${p.cat.toLowerCase()}`}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
              </button>
              <figcaption>
                <span>{p.title}</span>
                <span>{p.cat}</span>
              </figcaption>
            </figure>
          ))}
        </div>
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
            <fieldset>
              <legend>What do you need?</legend>
              <div className="needs" id="needs">
                <button type="button" aria-pressed="false">
                  Campaign visuals
                </button>
                <button type="button" aria-pressed="false">
                  Editorial series
                </button>
                <button type="button" aria-pressed="false">
                  Character design
                </button>
                <button type="button" aria-pressed="false">
                  Motion piece
                </button>
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
                <a href="https://instagram.com/elianvox" target="_blank" rel="noopener">
                  <span>Instagram</span>
                  <span>@elianvox</span>
                </a>
              </li>
              <li>
                <a href="https://www.behance.net/elianvox" target="_blank" rel="noopener">
                  <span>Behance</span>
                  <span>elianvox</span>
                </a>
              </li>
              <li>
                <a href="https://x.com/elianvox" target="_blank" rel="noopener">
                  <span>X</span>
                  <span>@elianvox</span>
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
      <footer>&copy; 2026 Elian Vox</footer>
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
    </>
  );
}
