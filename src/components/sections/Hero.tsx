import { site } from "@/config/site";
import { CallCta, QuizCta } from "../ui/Cta";
import { FloatingFormulas } from "./FloatingFormulas";
import { HeroMedia } from "./HeroMedia";

const delay = (s: number) => ({ ["--delay" as string]: `${s}s` }) as React.CSSProperties;

/**
 * Mobile-first cinematic hero: full-bleed video/photo with navy gradient, copy anchored to the
 * bottom of the first screen on phones (thumb zone) and to the left on desktop.
 */
export function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-navy-950 text-white lg:min-h-[min(100svh,56rem)] lg:justify-center">
      <HeroMedia />
      <p className="hero-in absolute bottom-10 right-10 z-10 hidden rounded-2xl lg:block bg-navy-950/70 px-3 py-1.5 text-right ring-1 ring-white/15 backdrop-blur-md" style={delay(0.5)}>
        <span className="block text-sm font-extrabold">{site.owner.name}</span>
        <span className="block text-[0.8125rem] font-semibold text-white/75">Założycielka ZdajMatme.com</span>
      </p>
      <div aria-hidden className="hidden lg:block">
        <FloatingFormulas />
      </div>

      <div className="container-x pb-14 pt-20 sm:pb-16 lg:pb-24 lg:pt-32">
        <div className="max-w-[40rem]">
          <p className="eyebrow hero-in hidden w-fit rounded-full sm:flex bg-navy-950/60 px-3.5 py-1.5 text-yellow-400 ring-1 ring-white/15 backdrop-blur-sm" style={delay(0)}>
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
            Korepetycje z matematyki online 1:1
          </p>
          <h1 className="hero-in-h1 h-display sm:mt-5">
            Twoje dziecko uczy się matematyki, ale{" "}
            <span className="relative inline-block text-yellow-400">
              wyniki nie rosną?
              <svg aria-hidden viewBox="0 0 300 20" preserveAspectRatio="none" className="underline-draw absolute -bottom-1.5 left-0 h-3 w-full sm:-bottom-2.5 sm:h-4">
                <path d="M3 14 C 70 4, 150 4, 297 10" fill="none" stroke="#FFC928" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="hero-in lead mt-4 max-w-xl !text-white/85" style={delay(0.15)}>
            Indywidualne korepetycje online, które pomagają zrozumieć matematykę.
          </p>
          <div data-hide-sticky className="hero-in mt-6 grid gap-2.5 sm:flex sm:gap-3" style={delay(0.25)}>
            <QuizCta location="hero" className="text-[1.05rem] sm:px-7">
              Dobierz korepetycje
            </QuizCta>
            <CallCta location="hero" />
          </div>
          <p className="hero-in mt-3 text-[0.9375rem] font-semibold text-white/70" style={delay(0.32)}>
            Lekcje online 1:1 <span className="mx-1.5 text-yellow-400">•</span> {site.price.label}
          </p>
          <a href="#sciezki" className="hero-in mt-6 inline-flex min-h-11 items-center gap-3 text-sm font-bold text-text-2 hover:text-white" style={delay(0.45)}>
            <span aria-hidden className="cue grid h-8 w-8 place-items-center rounded-full ring-1 ring-white/25">↓</span>
            Zobacz, jak pracujemy
          </a>
        </div>
      </div>
    </section>
  );
}
