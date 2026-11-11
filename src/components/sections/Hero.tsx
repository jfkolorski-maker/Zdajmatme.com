import Image from "next/image";
import { site } from "@/config/site";
import { CallCta, QuizCta } from "../ui/Cta";
import { Check } from "../ui/Icons";
import { FloatingFormulas } from "./FloatingFormulas";
import { ParabolaBoard } from "./ParabolaBoard";

const delay = (s: number) => ({ ["--delay" as string]: `${s}s` }) as React.CSSProperties;

export function Hero() {
  return (
    <section id="top" data-hide-sticky className="relative isolate overflow-hidden bg-navy-950 text-white">
      {/* background layers */}
      <div aria-hidden className="grid-paper absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_60%_40%,black_30%,transparent_75%)]" />
      <div aria-hidden className="absolute -right-40 top-10 -z-10 h-[34rem] w-[34rem] rounded-full bg-yellow-400/[0.09] blur-3xl" />
      <FloatingFormulas />

      <div className="container-x grid items-center gap-12 pb-16 pt-28 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:pb-24 lg:pt-36">
        {/* copy */}
        <div className="max-w-2xl">
          <p className="eyebrow hero-in rounded-full bg-white/[0.07] px-3.5 py-1.5 text-yellow-400 ring-1 ring-white/10" style={delay(0)}>
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
            Korepetycje z matematyki online 1:1
          </p>
          <h1 className="hero-in-h1 mt-6 text-[2.6rem] font-extrabold leading-[1.02] sm:text-6xl lg:text-[4.6rem]">
            Matematyka przestaje być{" "}
            <span className="relative inline-block whitespace-nowrap text-yellow-400">
              problemem.
              <svg aria-hidden viewBox="0 0 300 20" preserveAspectRatio="none" className="underline-draw absolute -bottom-2 left-0 h-3 w-full sm:-bottom-3 sm:h-4">
                <path d="M3 14 C 70 4, 150 4, 297 10" fill="none" stroke="#FFC928" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="hero-in mt-7 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl" style={delay(0.15)}>
            Indywidualne korepetycje online dla uczniów szkoły podstawowej i liceum. Przygotowanie do egzaminów, matury
            i skuteczne nadrabianie zaległości.
          </p>
          <div className="hero-in mt-9 flex flex-col gap-3 sm:flex-row" style={delay(0.25)}>
            <QuizCta location="hero" className="text-[1.05rem] sm:px-7">
              Dopasuj korepetycje
            </QuizCta>
            <CallCta location="hero" />
          </div>
          <p className="hero-in mt-4 text-[0.9375rem] font-semibold text-white/60" style={delay(0.32)}>
            Indywidualne lekcje online 1:1 <span className="mx-1.5 text-yellow-400">•</span> {site.price.label}
          </p>
          <ul className="hero-in mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-white/70" style={delay(0.4)}>
            {["Szkoła podstawowa i liceum", "Poziom podstawowy i rozszerzony", "Egzamin ósmoklasisty i matura"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-yellow-400" /> {t}
              </li>
            ))}
          </ul>
        </div>

        {/* visual */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="hero-in relative ml-auto w-full overflow-hidden rounded-[2rem] ring-1 ring-white/10 sm:w-[86%] lg:w-[84%]" style={delay(0.1)}>
            <div className="relative aspect-[4/5]">
              <Image
                src="/team/oliwia-siedlec.webp"
                alt="Oliwia Siedlec, założycielka ZdajMatme.com, przy biurku; w tle tablica z funkcją kwadratową"
                fill
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 60vw, 92vw"
                className="object-cover object-[50%_30%]"
              />
              <div className="absolute left-3 top-3 rounded-2xl bg-navy-950/75 px-4 py-2.5 ring-1 ring-white/15 backdrop-blur-md sm:left-4 sm:top-4">
                <p className="text-base font-extrabold leading-tight">{site.owner.name}</p>
                <p className="text-xs font-semibold text-white/75">Założycielka · dobierze korepetytora</p>
              </div>
            </div>
          </div>
          <div className="hero-in relative z-10 -mt-14 w-[92%] sm:w-[78%] lg:absolute lg:-left-10 lg:bottom-[-2.5rem] lg:mt-0 lg:w-[19rem] xl:-left-16" style={delay(0.45)}>
            <ParabolaBoard />
          </div>
        </div>
      </div>
    </section>
  );
}
