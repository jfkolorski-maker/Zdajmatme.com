import { faq } from "@/config/faq";
import { site } from "@/config/site";

export const seo = {
  title: "Korepetycje z matematyki online 1:1 — szkoła podstawowa, liceum, matura | ZdajMatme.com",
  description:
    "Indywidualne korepetycje z matematyki online dla szkoły podstawowej i liceum. Egzamin ósmoklasisty, matura podstawowa i rozszerzona, nadrabianie zaległości. 110 zł / 60 min.",
  keywords: [
    "korepetycje matematyka online",
    "korepetycje matematyka liceum",
    "korepetycje matematyka szkoła podstawowa",
    "korepetycje matura matematyka",
    "korepetycje matura rozszerzona matematyka",
    "przygotowanie do egzaminu ósmoklasisty matematyka",
    "indywidualne korepetycje online",
  ],
};

/** JSON-LD: organisation + service with the reference price + FAQ (only confirmed answers). */
export function structuredData() {
  const org = {
    "@type": "EducationalOrganization",
    "@id": `${site.url}/#org`,
    name: site.name,
    url: site.url,
    telephone: site.phone.e164,
    logo: `${site.url}/icon.svg`,
    founder: { "@type": "Person", name: site.owner.name, jobTitle: "CEO" },
    areaServed: { "@type": "Country", name: "Polska" },
    ...(site.legal.contactEmail ? { email: site.legal.contactEmail } : {}),
  };
  const service = {
    "@type": "Service",
    "@id": `${site.url}/#service`,
    name: "Indywidualne korepetycje z matematyki online 1:1",
    serviceType: "Korepetycje z matematyki",
    provider: { "@id": `${site.url}/#org` },
    areaServed: { "@type": "Country", name: "Polska" },
    audience: { "@type": "EducationalAudience", educationalRole: "student" },
    availableChannel: { "@type": "ServiceChannel", serviceUrl: site.url, servicePhone: site.phone.e164 },
    offers: {
      "@type": "Offer",
      price: site.price.amount,
      priceCurrency: site.price.currency,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: site.price.amount,
        priceCurrency: site.price.currency,
        referenceQuantity: { "@type": "QuantitativeValue", value: site.price.minutes, unitCode: "MIN" },
      },
    },
  };
  const faqPage = {
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const webpage = {
    "@type": "WebPage",
    "@id": `${site.url}/#webpage`,
    url: site.url,
    name: seo.title,
    inLanguage: "pl-PL",
    about: { "@id": `${site.url}/#service` },
    primaryImageOfPage: `${site.url}/team/oliwia-siedlec.webp`,
  };
  return { "@context": "https://schema.org", "@graph": [org, service, webpage, faqPage] };
}
