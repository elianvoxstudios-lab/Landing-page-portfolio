import type { MetadataRoute } from "next";
import { INDUSTRIES } from "@/data/industries";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/industries`, changeFrequency: "monthly", priority: 0.8 },
    ...INDUSTRIES.map((i) => ({
      url: `${SITE_URL}/industries/${i.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
