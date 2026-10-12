"use client";

import { usePathname } from "next/navigation";
import { useVelocityBlur } from "@/lib/useVelocityBlur";

/**
 * Site-wide smooth scrolling + scroll-velocity blur on every `.motion-text` element.
 * Lives in the root layout so it runs after each page's own effects, and re-attaches on
 * client-side navigation.
 */
export default function VelocityBlur() {
  useVelocityBlur(".motion-text", usePathname());
  return null;
}
