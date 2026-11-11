/**
 * Testimonials – ONLY real opinions with the author's consent.
 * Do not generate, paraphrase into stronger claims, or invent ratings / exam results.
 * When the array is empty, the section is not rendered at all.
 */
export interface Testimonial {
  id: string;
  quote: string;
  /** e.g. "Mama ucznia klasy 8" – as agreed with the author */
  author: string;
  /** Optional source, e.g. "Opinia Google" with a link */
  source?: { label: string; href?: string };
  /** ISO date of the original opinion */
  date?: string;
}

export const testimonials: Testimonial[] = [];
