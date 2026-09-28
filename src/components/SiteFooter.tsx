import Link from "next/link";
import { INDUSTRIES } from "@/data/industries";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <nav aria-label="Industries">
        <Link href="/industries">Industries</Link>
        {INDUSTRIES.map((i) => (
          <Link key={i.slug} href={`/industries/${i.slug}`}>
            {i.name}
          </Link>
        ))}
      </nav>
      <p>&copy; 2026 Elian Vox</p>
    </footer>
  );
}
