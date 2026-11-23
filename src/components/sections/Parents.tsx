import { FadeUp } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/motion/SectionHead";
import { Icon } from "@/components/ui/icons";
import { PARENTS } from "@/data/content";

/** 06 · Spokój i pewność dla każdego rodzica – accordion from zdajmatme.com (FLIPOR .faq style). */
export function Parents() {
  return (
    <section id="dla-rodzica" aria-labelledby="parents-title" className="section-y bg-surface text-white">
      <div className="shell">
        <SectionHead chapter="dla-rodzica" title={PARENTS.title} accent={PARENTS.accent} lead={PARENTS.lead} id="parents-title" />
        <div className="mx-auto mt-8 max-w-3xl space-y-2.5 md:mt-12">
          {PARENTS.items.map((f, i) => (
            <FadeUp key={f.q} delay={i * 0.04}>
              <details className="faq dtile group" open={i === 0}>
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-[1rem] font-semibold md:text-[1.08rem]">
                  {f.q}
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-accent transition-transform duration-300 group-open:rotate-45">
                    <Icon name="plus" size={18} />
                  </span>
                </summary>
                <p className="px-5 pb-5 text-left leading-relaxed text-white/65">{f.a}</p>
              </details>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
