import { FadeUp } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/motion/SectionHead";
import { Icon } from "@/components/ui/icons";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { FAQ } from "@/data/content";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y bg-surface text-white">
      <div className="shell">
        <SectionHead chapter="faq" title="Najczęściej zadawane pytania" lead="Krótko o lekcjach, materiałach, płatnościach i odwoływaniu zajęć." id="faq-title" />
        <div className="mx-auto mt-8 max-w-3xl space-y-2.5 md:mt-12">
          {FAQ.map((f, i) => (
            <FadeUp key={f.q} delay={Math.min(i, 3) * 0.04}>
              <details className="faq dtile group">
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
        <FadeUp className="mt-8 text-center">
          <p className="text-white/60">Nie ma tu Twojego pytania?</p>
          <PhoneLink placement="faq" className="mt-1 inline-flex items-center gap-2 text-lg font-bold text-accent">
            <Icon name="phone" size={18} /> Zadzwoń – odpowie Oliwia
          </PhoneLink>
        </FadeUp>
      </div>
    </section>
  );
}
