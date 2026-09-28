import Link from "next/link";

/** Top bar for inner pages (the homepage draws its own over the hero). */
export default function SiteHeader() {
  return (
    <header className="sub-bar">
      <Link className="mark" href="/">
        Elian Vox
      </Link>
      <nav aria-label="Main">
        <Link href="/#work">Work</Link>
        <Link href="/#services">Services</Link>
        <Link href="/industries">Industries</Link>
        <Link href="/#contact">Contact</Link>
      </nav>
    </header>
  );
}
