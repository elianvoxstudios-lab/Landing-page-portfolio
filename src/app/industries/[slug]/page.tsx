import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import IndustryTiles from "@/components/IndustryTiles";
import MediaView from "@/components/MediaView";
import { INDUSTRIES, industryBySlug } from "@/data/industries";
import { serviceBySlug } from "@/data/services";
import { industryCover, industryMedia } from "@/lib/media";
import { DEFAULT_OG } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/industries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const ind = industryBySlug(slug);
  if (!ind) return {};
  const cover = industryCover(ind.slug, ind.cover);
  const url = `/industries/${ind.slug}`;
  return {
    title: ind.seo.title,
    description: ind.seo.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${ind.seo.title} | Elian Vox`,
      description: ind.seo.description,
      url,
      type: "website",
      images: cover
        ? [{ url: cover.poster ?? cover.src, width: cover.width, height: cover.height, alt: cover.alt }]
        : [{ url: DEFAULT_OG }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function IndustryPage({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const ind = industryBySlug(slug);
  if (!ind) notFound();

  const media = industryMedia(ind.slug);
  const cover = industryCover(ind.slug, ind.cover);
  // The cover leads the hero; the gallery shows the full set so small sets don't look sparse
  const gallery = media;
  const services = ind.services.map(serviceBySlug).filter((s) => !!s);
  const brief = `/?industry=${ind.slug}#contact`;

  return (
    <>
      <SiteHeader />
      <main className="page">
        <section className="ind-hero">
          <div className="ind-hero-copy">
            <p className="kicker">
              <i aria-hidden="true"></i>
              <Link href="/industries">Industries</Link>
            </p>
            <h1>{ind.name}</h1>
            <p className="ind-line">{ind.line}</p>
            <p className="page-lede">{ind.intro}</p>
            <div className="hero-ctas">
              <Link className="intro-cta" href={brief}>
                Start a project <span aria-hidden="true">&rarr;</span>
              </Link>
              {media.length > 0 && (
                <a className="ghost-cta" href="#gallery">
                  See the work
                </a>
              )}
            </div>
          </div>
          {cover && (
            <figure className="ind-hero-media">
              <MediaView {...cover} priority />
              <figcaption>{cover.alt}</figcaption>
            </figure>
          )}
        </section>

        <section className="page-sec" aria-labelledby="make-title">
          <div className="sec-head">
            <h2 id="make-title">
              What we <em>make</em>
            </h2>
          </div>
          <ol className="why-grid make-grid">
            {ind.make.map((m, i) => (
              <li key={m.title}>
                <span className="no">{String(i + 1).padStart(2, "0")}</span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="page-sec" id="gallery" aria-labelledby="gallery-title">
          <div className="sec-head">
            <h2 id="gallery-title">
              Selected <em>work</em>
            </h2>
          </div>
          {gallery.length > 0 ? (
            <ul className="gallery">
              {gallery.map((m) => (
                <li key={m.src}>
                  <figure>
                    <MediaView {...m} />
                    <figcaption>{m.alt}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ) : (
            <p className="gallery-empty">
              New {ind.name} work is on its way. <Link href={brief}>Ask us for the latest reel</Link>.
            </p>
          )}
        </section>

        <section className="page-sec" aria-labelledby="svc-title">
          <div className="sec-head">
            <h2 id="svc-title">
              How we <em>help</em>
            </h2>
          </div>
          <ul className="svc-cards">
            {services.map((s) => (
              <li key={s.slug}>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <Link className="enquire" href={`/?service=${s.slug}&industry=${ind.slug}#contact`}>
                  Enquire <span aria-hidden="true">&rarr;</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="cta-band">
          <h2>
            Got a brief in <em>{ind.name}?</em>
          </h2>
          <Link className="intro-cta" href={brief}>
            Start a project <span aria-hidden="true">&rarr;</span>
          </Link>
        </section>

        <section className="page-sec" aria-labelledby="more-title">
          <div className="sec-head">
            <h2 id="more-title">
              Other <em>industries</em>
            </h2>
            <Link className="more-link" href="/industries">
              All industries &rarr;
            </Link>
          </div>
          <IndustryTiles exclude={ind.slug} compact />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
