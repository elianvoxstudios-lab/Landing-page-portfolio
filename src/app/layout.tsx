import type { Metadata } from "next";
import { Archivo, Fraunces } from "next/font/google";
import "./globals.css";
import { DEFAULT_OG, SITE_NAME, SITE_URL } from "@/lib/site";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-fraunces",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Elian Vox | AI-Powered Creative & Social Media Studio",
    template: "%s | Elian Vox",
  },
  description:
    "Campaigns, content and social systems that make brands impossible to ignore. AI-powered creative and social media studio.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    title: "Elian Vox | AI-Powered Creative & Social Media Studio",
    description: "Campaigns, content and social systems that make brands impossible to ignore.",
    url: "/",
    images: [{ url: DEFAULT_OG }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
