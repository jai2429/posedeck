import type { MetadataRoute } from "next";
import { CATEGORIES, POSES } from "@/core";
import { site } from "@/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, priority: 1 },
    ...CATEGORIES.map((c) => ({ url: `${site.url}/c/${c.who}`, priority: 0.8 })),
    ...POSES.map((p) => ({ url: `${site.url}/pose/${p.slug}`, priority: 0.6 })),
  ];
}
