import { site } from "@/config/site";
import { CallCta, QuizCta } from "../ui/Cta";
import { FloatingFormulas } from "./FloatingFormulas";
import { HeroMedia } from "./HeroMedia";

const delay = (s: number) => ({ ["--delay" as string]: `${s}s` }) as React.CSSProperties;

/** Only verifiable facts. TODO: potwierdzić / dopisać prawdziwe liczby (opinie, liczba uczniów) gdy będą dostępne. */
const TRUST = ["Szkoła podstawowa i liceum", site.price.label, "Podstawa i rozszerzenie"];

/**
 * Hero: full screen on phones (100svh), photo/video full height, darkening only at the bottom,
 * copy + stacked buttons centered in the lower part. H1 is visible from the first frame (no JS);
 * buttons, kicker and trust line rise in at 0.15 / 0.3 / 0.4 s.
 */
export function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-navy-950 lg:min-h-[min(100svh,58rem)] lg:justify-center">
      <HeroMedia />
      <div aria-hidden className="hidden lg:block">
        <FloatingFormulas />
      </div>

      <div className="container-x pb-8 pt-28 lg:pb-20 lg:pt-36">
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-[40rem] lg:text-left">
          <h1 className="h1">
            <span className="block text-white">Twoje dziecko uczy się matematyki,</span>
            <span className="block text-yellow-400">ale wyniki nie rosną?</span>
          </h1>
          <p className="lead mt-4 text-white/85">Indywidualne korepetycje online, które pomagają zrozumieć matematykę.</p>

          <div data-hide-sticky className="rise mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center lg:justify-start" style={delay(0.15)}>
            <QuizCta location="hero" className="w-full sm:w-auto">
              Dobierz korepetycje
            </QuizCta>
            <CallCta location="hero" className="w-full sm:w-auto" />
          </div>

          <p className="kicker rise mt-6 justify-center text-white/65 lg:justify-start" style={delay(0.3)}>
            ZdajMatme.com · online 1:1
          </p>
          <ul className="rise mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[0.95rem] font-semibold text-white/85 lg:justify-start" style={delay(0.4)}>
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <span aria-hidden className="text-yellow-400">✓</span> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="rise absolute bottom-10 right-10 z-10 hidden rounded-2xl bg-navy-950/70 px-3.5 py-2 text-right ring-1 ring-white/15 backdrop-blur-md lg:block" style={delay(0.5)}>
        <span className="block text-sm font-bold">{site.owner.name}</span>
        <span className="block text-[0.8125rem] font-semibold text-white/70">Założycielka ZdajMatme.com</span>
      </p>
    </section>
  );
}
