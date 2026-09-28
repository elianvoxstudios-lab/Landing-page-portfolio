// Every industry page, hub tile, homepage teaser link, form option and sitemap entry comes
// from this list. To add an industry: add an entry here and a folder at
// public/industries/<slug>/ with its images/videos and a captions.md (see existing folders).

export type Industry = {
  slug: string;
  name: string;
  /** One-liner used on tiles, the teaser and as the page lede. */
  line: string;
  /** Opening paragraph under the page headline. */
  intro: string;
  /** What we make for this industry. */
  make: { title: string; desc: string }[];
  /** 3–4 service slugs from src/data/services.ts. */
  services: string[];
  /** File in public/industries/<slug>/ used as hub tile, page hero and share image. */
  cover?: string;
  seo: { title: string; description: string };
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "fashion",
    name: "Fashion & Apparel",
    line: "Lookbooks and campaigns in any location, before a sample is shot.",
    intro:
      "Put a collection on location, on model and on every channel while the samples are still in production. We build seasonal campaigns, lookbooks and drop content around your real garments, so launches stop waiting on shoot days.",
    make: [
      { title: "Seasonal campaigns", desc: "Key visuals and films for each drop, set in locations you would never fly a crew to." },
      { title: "Lookbooks & line sheets", desc: "Consistent model, pose and lighting across the whole range." },
      { title: "Drop & social content", desc: "Reels, carousels and stories cut for launch week and beyond." },
      { title: "Editorial stories", desc: "Magazine-grade image series that give the collection a point of view." },
    ],
    services: ["product-lifestyle-imagery", "brand-editorial-visuals", "social-media-content", "ai-films-commercials"],
    cover: "gold-shell-editorial.webp",
    seo: {
      title: "AI Fashion Campaigns & Lookbooks",
      description:
        "AI-powered fashion campaigns, lookbooks and social content in any location, before a sample is shot. Elian Vox creative studio.",
    },
  },
  {
    slug: "beauty-cosmetics",
    name: "Beauty & Cosmetics",
    line: "Ingredient worlds and textures without days of tabletop shoots.",
    intro:
      "Swatches, drips, splashes and ingredient worlds, built around your actual packaging. We create launch campaigns and always-on content for skincare, makeup and fragrance without booking a tabletop studio for every shade.",
    make: [
      { title: "Launch key visuals", desc: "Hero imagery for new products and ranges, ready for every retailer." },
      { title: "Texture & ingredient worlds", desc: "Swatches, pours and botanicals that are hard to capture for real." },
      { title: "Fragrance storytelling", desc: "Moods, sets and films that make a scent visible." },
      { title: "Social & retail assets", desc: "Shade-by-shade variants for feeds, PDPs and in-store screens." },
    ],
    services: ["product-lifestyle-imagery", "ai-campaign-production", "social-media-content", "performance-ad-creative"],
    cover: "elian-vox-fragrance.webp",
    seo: {
      title: "AI Beauty & Cosmetics Campaigns",
      description:
        "Beauty, skincare and fragrance campaigns with ingredient worlds and textures, without days of tabletop shoots. Elian Vox creative studio.",
    },
  },
  {
    slug: "jewellery-luxury",
    name: "Jewellery & Luxury",
    line: "Environments and macro shots impossible to film for real.",
    intro:
      "Stones in impossible light, pieces in places no insurer would allow. We create macro imagery, campaign worlds and films for jewellery, watch and luxury houses, crafted to the standard the product demands.",
    make: [
      { title: "Macro product imagery", desc: "Facets, settings and finishes in razor-sharp detail." },
      { title: "Campaign environments", desc: "Surreal and architectural sets that would be impossible to build." },
      { title: "Collection films", desc: "Slow, cinematic spots for launches and high jewellery moments." },
      { title: "Editorial & covers", desc: "Still-life stories for print, press and lookbooks." },
    ],
    services: ["brand-editorial-visuals", "product-lifestyle-imagery", "ai-films-commercials", "motion-post-production"],
    cover: "emerald-drop-earrings.webp",
    seo: {
      title: "AI Jewellery & Luxury Campaigns",
      description:
        "Jewellery and luxury campaigns with macro shots and environments impossible to film for real. Elian Vox creative studio.",
    },
  },
  {
    slug: "fmcg",
    name: "FMCG & Food",
    line: "Seasonal and festive campaigns without reshooting every time.",
    intro:
      "Food and drink that looks its best in every season. We turn your packshots into festive, seasonal and flavour campaigns, then build the variants retailers and feeds need, without a reshoot for every promotion.",
    make: [
      { title: "Seasonal & festive campaigns", desc: "New looks for every holiday and promotion from the same packshots." },
      { title: "Packshots & flavour worlds", desc: "Pours, splashes, ingredients and serving moments." },
      { title: "Retail & e-commerce assets", desc: "Listings, banners and in-store screens in every size." },
      { title: "Social content", desc: "Always-on reels and posts that keep the brand in the feed." },
    ],
    services: ["ai-campaign-production", "social-media-content", "performance-ad-creative", "product-lifestyle-imagery"],
    cover: "elian-vox-hot-sauce.webp",
    seo: {
      title: "AI FMCG & Food Campaigns",
      description:
        "Seasonal and festive food and drink campaigns without reshooting every time. Packshots, social and retail assets by Elian Vox.",
    },
  },
  {
    slug: "hospitality",
    name: "Hospitality",
    line: "Rooms, menus and destinations shown in every season, before the season starts.",
    intro:
      "Hotels, restaurants and destinations sell a feeling before a guest arrives. We create seasonal imagery, menu launches and destination films from what you already have, so every campaign looks like the best day of the year.",
    make: [
      { title: "Seasonal destination imagery", desc: "Summer terraces in winter and snowy views in spring." },
      { title: "Menu & F&B launches", desc: "Dishes and drinks styled for menus, delivery apps and social." },
      { title: "Destination films", desc: "Short films that sell the stay, the view and the mood." },
      { title: "Always-on social", desc: "Content calendars that keep bookings coming between campaigns." },
    ],
    services: ["product-lifestyle-imagery", "social-media-content", "ai-films-commercials", "brand-editorial-visuals"],
    seo: {
      title: "AI Hospitality Campaigns for Hotels & Restaurants",
      description:
        "Hotel, restaurant and destination imagery and films in every season, before the season starts. Elian Vox creative studio.",
    },
  },
  {
    slug: "ecommerce",
    name: "E-commerce & D2C",
    line: "Dozens of ad variations for testing, in days not weeks.",
    intro:
      "Direct-to-consumer brands live and die by testing. We turn your product catalogue into hooks, formats and angles for paid social, plus the product pages and emails that convert the click.",
    make: [
      { title: "Ad variation sets", desc: "Dozens of hooks, angles and formats, ready to test." },
      { title: "Product page imagery", desc: "Clean packshots, lifestyle scenes and detail shots." },
      { title: "UGC-style & social content", desc: "Native-feeling content for feeds and stories." },
      { title: "Launch & promo creative", desc: "Drops, bundles and sale moments across every channel." },
    ],
    services: ["performance-ad-creative", "product-lifestyle-imagery", "social-media-content", "motion-post-production"],
    cover: "elian-vox-bottles.webp",
    seo: {
      title: "AI Ad Creative for E-commerce & D2C Brands",
      description:
        "Dozens of ad variations for testing in days, not weeks, plus product and social imagery for D2C brands. Elian Vox creative studio.",
    },
  },
  {
    slug: "construction-industrial",
    name: "Construction & Industrial",
    line: "Site hoardings, safety campaigns and workwear shoots without stopping work on site.",
    intro:
      "Industrial brands rarely get the creative they deserve. We make hoardings, safety campaigns, recruitment ads and workwear imagery that look as solid as what you build, without pulling a crew onto a live site.",
    make: [
      { title: "Site hoardings & OOH", desc: "Large-format visuals for scaffolding, fences and billboards." },
      { title: "Safety & recruitment campaigns", desc: "Clear, human campaigns people actually notice." },
      { title: "Workwear & PPE imagery", desc: "Product and on-model shots for catalogues and e-commerce." },
      { title: "Project & brand films", desc: "Progress stories and brand films for bids and launches." },
    ],
    services: ["ai-campaign-production", "brand-editorial-visuals", "ai-films-commercials", "social-media-content"],
    cover: "hard-hat-portrait.webp",
    seo: {
      title: "AI Campaigns for Construction & Industrial Brands",
      description:
        "Site hoardings, safety campaigns and workwear imagery without stopping work on site. Elian Vox creative studio.",
    },
  },
];

export const industryBySlug = (slug: string) => INDUSTRIES.find((i) => i.slug === slug);
