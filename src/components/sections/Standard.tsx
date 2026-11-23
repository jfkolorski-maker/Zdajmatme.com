import { FadeUp } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/motion/SectionHead";
import { Icon } from "@/components/ui/icons";
import { HOW } from "@/data/content";

/** 05 · Jak uczymy? – the two principles from zdajmatme.com as dark tiles. */
export function Standard() {
  return (
    <section id="jak-uczymy" aria-labelledby="how-title" className="section-y bg-night text-white">
      <div className="shell">
        <SectionHead chapter="jak-uczymy" title={HOW.title} accent={HOW.accent} id="how-title" />
        <ul className="mx-auto mt-8 grid max-w-4xl gap-3 md:mt-12 md:grid-cols-2 md:gap-5">
          {HOW.items.map((b, i) => (
            <FadeUp as="li" soft key={b.title} delay={i * 0.08} className="dtile flex flex-col items-center px-6 py-7 text-center md:px-8 md:py-9">
              <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-accent/12 text-accent">
                <Icon name={b.icon} size={24} />
              </span>
              <h3 className="mt-4 text-[1.15rem] font-semibold">{b.title}</h3>
              <p className="mt-2 text-[0.98rem] leading-relaxed text-white/65">{b.text}</p>
            </FadeUp>
          ))}
        </ul>
      </div>
    </section>
  );
}
