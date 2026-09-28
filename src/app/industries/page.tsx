import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import IndustryTiles from "@/components/IndustryTiles";
import { INDUSTRIES } from "@/data/industries";
import { industryCover } from "@/lib/media";

const cover = industryCover(INDUSTRIES[0].slug, INDUSTRIES[0].cover);

export const metadata: Metadata = {
  title: "Industries | AI Creative for Every Sector",
  description:
    "AI-powered campaigns, social content and imagery for fashion, beauty, jewellery, FMCG, hospitality, e-commerce and construction brands.",
  alternates: { canonical: "/industries" },
  openGraph: {
    title: "Industries | Elian Vox",
    description: "Creative built for different worlds: AI-powered campaigns and content, sector by sector.",
    url: "/industries",
    images: cover ? [{ url: cover.src, width: cover.width, height: cover.height }] : undefined,
  },
};

export default function IndustriesHub() {
  return (
    <>
      <SiteHeader />
      <main className="page">
        <section className="page-head">
          <p className="kicker">
            <i aria-hidden="true"></i>Industries
          </p>
          <h1>
            Creative built for <em>different</em> worlds
          </h1>
          <p className="page-lede">
            Every sector has its own rules, rhythms and audiences. Pick yours to see what we make for it, the work behind
            it and how we can help.
          </p>
        </section>
        <section className="page-sec" aria-label="Industries">
          <IndustryTiles />
        </section>
        <section className="cta-band">
          <h2>
            Not on the list? <em>Tell us</em> about your world.
          </h2>
          <Link className="intro-cta" href="/#contact">
            Start a project <span aria-hidden="true">&rarr;</span>
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
