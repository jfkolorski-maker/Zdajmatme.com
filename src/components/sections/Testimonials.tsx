import { testimonials } from "@/config/testimonials";
import { Reveal } from "../ui/Reveal";

/** Renders nothing until real, consented testimonials are added in config/testimonials.ts. */
export function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <section id="opinie" className="py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-navy-600">Opinie</p>
          <h2 className="h-section mt-3">Co mówią rodzice i uczniowie</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.06}>
              <figure className="h-full rounded-[var(--radius-card)] bg-white p-7 shadow-[var(--shadow-soft)] ring-1 ring-black/5">
                <blockquote className="text-lg leading-relaxed">„{t.quote}”</blockquote>
                <figcaption className="mt-5 text-sm font-bold text-ink-muted">
                  {t.author}
                  {t.source &&
                    (t.source.href ? (
                      <>
                        {" · "}
                        <a href={t.source.href} className="underline" rel="nofollow noopener" target="_blank">
                          {t.source.label}
                        </a>
                      </>
                    ) : (
                      ` · ${t.source.label}`
                    ))}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
