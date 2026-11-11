/**
 * Central brand & contact configuration.
 * Change contact data ONLY here – every CTA, JSON-LD and footer reads from this file.
 */
export const site = {
  name: "ZdajMatme.com",
  shortName: "ZdajMatme",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://zdajmatme.com").replace(/\/$/, ""),
  locale: "pl_PL",
  phone: {
    display: "730 170 804",
    e164: "+48730170804",
    href: "tel:+48730170804",
  },
  owner: {
    name: "Oliwia Siedlec",
    firstName: "Oliwia",
    /** Polish case forms used in copy */
    firstNameGenitive: "Oliwii",
    firstNameInstrumental: "Oliwią",
    role: "Założycielka i CEO ZdajMatme.com",
  },
  price: {
    amount: 110,
    currency: "PLN",
    minutes: 60,
    label: "110 zł / 60 min",
  },
  /**
   * Legal entity data for the privacy policy & JSON-LD.
   * TODO(before launch): fill in the real data of the data controller.
   */
  legal: {
    controllerName: process.env.NEXT_PUBLIC_LEGAL_NAME || "",
    address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS || "",
    taxId: process.env.NEXT_PUBLIC_LEGAL_NIP || "",
    contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  },
} as const;

export type Site = typeof site;
