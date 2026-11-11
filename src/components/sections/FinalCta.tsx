import { site } from "@/config/site";
import { CallCta, QuizCta } from "../ui/Cta";
import { Reveal } from "../ui/Reveal";

export function FinalCta() {
  return (
    <section className="pb-20 sm:pb-28">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-yellow-400 px-6 py-12 text-navy-950 sm:px-12 sm:py-16">
            <span aria-hidden className="math pointer-events-none absolute -right-6 -top-10 select-none text-[12rem] leading-none text-navy-950/[0.07] sm:text-[16rem]">
              ∑
            </span>
            <div className="relative max-w-2xl">
              <h2 className="h-section">Porozmawiaj z Oliwią o matematyce ucznia.</h2>
              <p className="mt-4 text-lg font-medium text-navy-950/75">
                Wypełnij krótki quiz albo zadzwoń. Indywidualne lekcje online 1:1 · {site.price.label}.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <QuizCta location="final_cta" variant="navy">
                  Dopasuj korepetycje
                </QuizCta>
                <CallCta location="final_cta" variant="ghost-light">
                  Zadzwoń: {site.phone.display}
                </CallCta>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
