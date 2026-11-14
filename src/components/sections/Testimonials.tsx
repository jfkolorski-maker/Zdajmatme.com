import { testimonials } from "@/config/testimonials";
import { Chapter } from "../ui/Chapter";

/** Renders nothing until real, consented testimonials are added in config/testimonials.ts. */
export function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <Chapter id="opinie" title="Co mówią rodzice i uczniowie">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.id} className="card-dark h-full p-6">
            <blockquote className="text-lg">„{t.quote}”</blockquote>
            <figcaption className="mt-4 text-sm font-semibold text-white/60">
              {t.author}
              {t.source && <> · {t.source.href ? <a href={t.source.href} className="underline" rel="nofollow noopener" target="_blank">{t.source.label}</a> : t.source.label}</>}
            </figcaption>
          </figure>
        ))}
      </div>
    </Chapter>
  );
}
