import { site } from "@/config/site";
import { CallCta, QuizCta } from "../ui/Cta";
import { Chapter } from "../ui/Chapter";

/** 07 · Kontakt — the decision point. */
export function Contact() {
  return (
    <Chapter id="kontakt" data-hide-sticky title={<>Zacznijmy od<br />jednej rozmowy.</>} lead={`Odpowiedz na kilka pytań albo zadzwoń — ${site.owner.firstName} pomoże wybrać korepetytora i plan nauki.`}>
      <div className="mx-auto flex max-w-md flex-col gap-2.5">
        <QuizCta location="contact">Dobierz korepetycje</QuizCta>
        <CallCta location="contact" />
        <p className="mt-2 text-center text-sm text-white/55">
          {site.owner.name} · {site.owner.role}
        </p>
      </div>
    </Chapter>
  );
}
