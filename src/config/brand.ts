/**
 * Company data – the single source of truth for name, contact and figures.
 * Source: zdajmatme.com (footer, contact) + the owner's brief (price, Oliwia).
 */
export const BRAND = {
  name: "ZdajMatme.com",
  shortName: "ZdajMatme",
  tagline: "Matematyka, która buduje pewność siebie",
  /** Canonical address: NEXT_PUBLIC_SITE_URL, else Vercel's production URL, else zdajmatme.com. */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://zdajmatme.com")
  ).replace(/\/$/, ""),
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "730 170 804",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "zdajtoznami@gmail.com",
  privacyUrl: process.env.NEXT_PUBLIC_PRIVACY_URL || "/polityka-prywatnosci",
  owner: { name: "Oliwia Siedlec", first: "Oliwia", genitive: "Oliwii", role: "Założycielka – ZdajMatme.com" },
  /** Reference price for individual 1:1 lessons (owner's brief). Courses: price discussed on the call. */
  price: { amount: 110, minutes: 60, label: "110 zł / 60 min" },
  seo: {
    title: "Korepetycje z matematyki online 1:1, kurs ósmoklasisty i maturalny | ZdajMatme.com",
    description:
      "Korepetycje indywidualne z matematyki online, kurs do egzaminu ósmoklasisty i kurs maturalny 2026 (podstawa i rozszerzenie). Zajęcia na Microsoft Teams z wirtualną tablicą. Umów pierwszą lekcję.",
  },
} as const;

/** tel: link – Polish numbers get +48. */
export const telHref = (phone: string = BRAND.phone) => {
  const d = phone.replace(/[^\d+]/g, "");
  return `tel:${d.startsWith("+") ? d : `+48${d}`}`;
};
