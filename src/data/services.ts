// Single source for services: the homepage list, the contact form options and the
// "relevant services" on each industry page all read from here.

export type Service = {
  slug: string;
  title: string;
  sub: string;
  desc: string;
  tags: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "ai-campaign-production",
    title: "AI Campaign Production",
    sub: "One idea, every asset the campaign needs",
    desc: "Concept to final assets: hero visuals, films, cutdowns, social and display variants.",
    tags: ["Hero visuals", "Campaign films", "Cutdowns", "Social & display variants"],
  },
  {
    slug: "social-media-content",
    title: "Social Media Content",
    sub: "Always-on content for every feed",
    desc: "Always-on reels, carousels, posts and stories for every platform.",
    tags: ["Reels & TikTok", "Carousels", "Posts & stories", "Monthly content plans"],
  },
  {
    slug: "product-lifestyle-imagery",
    title: "Product & Lifestyle Imagery",
    sub: "New worlds for the products you already have",
    desc: "New campaign worlds from your existing product shots, no reshoot needed.",
    tags: ["Product worlds", "Lifestyle scenes", "Seasonal refreshes", "E-commerce imagery"],
  },
  {
    slug: "ai-films-commercials",
    title: "AI Films & Commercials",
    sub: "Story-led films for launches and campaigns",
    desc: "Story-led ad films for launches and campaigns.",
    tags: ["Launch films", "TV & online spots", "Brand stories", "Scripts & storyboards"],
  },
  {
    slug: "performance-ad-creative",
    title: "Performance Ad Creative",
    sub: "Built to be tested, then scaled",
    desc: "Multiple hooks, formats and versions built for paid-media testing.",
    tags: ["Hook variations", "Every ad format", "A/B test sets", "Paid social & display"],
  },
  {
    slug: "motion-post-production",
    title: "Motion & Post Production",
    sub: "Edit, animate, finish",
    desc: "Editing, animation, VFX, typography and sound.",
    tags: ["Editing", "Animation", "VFX", "Type & sound design"],
  },
  {
    slug: "brand-editorial-visuals",
    title: "Brand & Editorial Visuals",
    sub: "Images that define how a brand looks",
    desc: "Key visuals, editorials, covers and visual systems.",
    tags: ["Key visuals", "Editorials", "Covers", "Visual systems"],
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
