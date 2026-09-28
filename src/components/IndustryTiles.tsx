import Link from "next/link";
import { INDUSTRIES } from "@/data/industries";
import { industryCover } from "@/lib/media";
import MediaView from "./MediaView";

/** Clickable industry cards with cover images (hub page and "other industries"). */
export default function IndustryTiles({ exclude, compact }: { exclude?: string; compact?: boolean }) {
  const list = INDUSTRIES.filter((i) => i.slug !== exclude);
  return (
    <ul className={"ind-tiles" + (compact ? " compact" : "")}>
      {list.map((ind) => {
        const cover = industryCover(ind.slug, ind.cover);
        return (
          <li key={ind.slug}>
            <Link href={`/industries/${ind.slug}`} className="ind-tile">
              <span className="ind-tile-img">
                {cover ? (
                  <MediaView
                    src={cover.poster ?? cover.src}
                    alt=""
                    kind="image"
                    width={cover.width}
                    height={cover.height}
                  />
                ) : (
                  <span className="ind-tile-empty" aria-hidden="true">
                    {ind.name}
                  </span>
                )}
              </span>
              <span className="ind-tile-body">
                <b>{ind.name}</b>
                {!compact && <span>{ind.line}</span>}
                <i aria-hidden="true">&rarr;</i>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
