import type { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: BRAND.url, changeFrequency: "monthly", priority: 1 },
    { url: `${BRAND.url}/korepetycje-indywidualne`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BRAND.url}/kurs-osmoklasisty`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BRAND.url}/kurs-maturalny`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BRAND.url}/o-nas`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BRAND.url}/kontakt`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BRAND.url}/polityka-prywatnosci`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BRAND.url}/regulamin`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
