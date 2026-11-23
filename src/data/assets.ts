/**
 * Photos used on the page – all from zdajmatme.com (plus Oliwia's portrait supplied by the owner).
 * Rule: a photo is always shown in a box of its own aspect ratio.
 */
export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const PHOTOS = {
  hero: { src: "/images/hero.webp", alt: "Uczennica uczy się matematyki online z korepetytorem na laptopie", width: 1024, height: 1536 },
  oliwia: { src: "/team/oliwia-siedlec.webp", alt: "Oliwia Siedlec, założycielka ZdajMatme.com", width: 864, height: 1536 },
} satisfies Record<string, Photo>;
