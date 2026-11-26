import { FadeUp, ImageReveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/motion/SectionHead";
import { Icon } from "@/components/ui/icons";
import { ABOUT } from "@/data/content";

/** 07 · O nas – "Uczymy inaczej – uczymy skutecznie": photo + mission + three points (zdajmatme.com). */
export function About() {
  return (
    <section id="o-nas" aria-labelledby="about-title" className="section-y bg-night text-white">
      <div className="shell">
        <SectionHead chapter="o-nas" title={ABOUT.title} accent={ABOUT.accent} lead={ABOUT.lead} id="about-title" />
        <div className="mx-auto mt-8 grid max-w-5xl items-center gap-8 md:mt-12 md:grid-cols-2 md:gap-12">
          <ImageReveal src={ABOUT.photo.src} alt={ABOUT.photo.alt} sizes="(min-width: 768px) 46vw, 92vw" className="aspect-[3/2] w-full rounded-[22px]" />
          <ol className="border-t border-accent">
            {ABOUT.points.map((b, i) => (
              <FadeUp as="li" key={b.title} delay={i * 0.08} className="flex gap-4 border-b border-accent py-5 md:py-6">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-accent/12 text-accent">
                  <Icon name={b.icon} size={20} />
                </span>
                <div>
                  <h3 className="text-[1.08rem] font-semibold leading-snug md:text-[1.15rem]">{b.title}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-white/65">{b.text}</p>
                </div>
              </FadeUp>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
