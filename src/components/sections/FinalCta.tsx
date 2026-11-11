import { site } from "@/config/site";
import { CallCta, QuizCta } from "../ui/Cta";
import { Chapter } from "../ui/Chapter";

/** Closing chapter – the decision point. Copy intentionally differs from the hero. */
export function FinalCta() {
  return (
    <Chapter
      id="start"
      tone="finale"
      noNext
      titleText="Zacznijmy od jednej rozmowy."
      title="Zacznijmy od jednej rozmowy."
      lead={`Odpowiedz na kilka pytań albo zadzwoń — ${site.owner.firstName} pomoże wybrać korepetytora i plan nauki.`}
      className="!pb-28"
    >
      <span aria-hidden className="math pointer-events-none absolute -top-24 right-0 select-none text-[11rem] leading-none text-yellow-400/[0.07] sm:text-[16rem]">∑</span>
      <div data-hide-sticky className="relative grid gap-3 sm:flex">
        <QuizCta location="final_cta">Dobierz korepetycje</QuizCta>
        <CallCta location="final_cta" variant="ghost-light">
          Zadzwoń: {site.phone.display}
        </CallCta>
      </div>
    </Chapter>
  );
}
