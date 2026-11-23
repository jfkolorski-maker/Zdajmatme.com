import type { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: BRAND.url, changeFrequency: "monthly", priority: 1 },
    { url: `${BRAND.url}/polityka-prywatnosci`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BRAND.url}/regulamin`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
