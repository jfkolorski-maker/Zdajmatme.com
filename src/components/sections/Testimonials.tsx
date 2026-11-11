import { testimonials } from "@/config/testimonials";
import { Reveal } from "../ui/Reveal";
import { Chapter } from "../ui/Chapter";

/** Renders nothing until real, consented testimonials are added in config/testimonials.ts. */
export function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <Chapter id="opinie" titleText="Co mówią rodzice i uczniowie" title="Co mówią rodzice i uczniowie">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.id} delay={i * 0.06}>
            <figure className="surface h-full p-6">
              <blockquote className="text-lg leading-relaxed">„{t.quote}”</blockquote>
              <figcaption className="mt-5 text-sm font-bold text-text-3">
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
    </Chapter>
  );
}
