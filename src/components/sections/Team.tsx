"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { tutors, type Tutor } from "@/config/tutors";
import { track } from "@/lib/tracking";
import { QuizCta } from "../ui/Cta";
import { Chapter } from "../ui/Chapter";

function useProfileView(slug: string) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        track("tutor_profile_view", { tutor_slug: slug });
        io.disconnect();
      }
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [slug]);
  return ref;
}

function TutorCard({ t }: { t: Tutor }) {
  const ref = useProfileView(t.slug);
  return (
    <article ref={ref} className="card-dark mx-auto w-full max-w-md overflow-hidden text-center">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image src={t.photo.src} alt={t.photo.alt} fill sizes="(min-width: 640px) 28rem, 100vw" className="object-cover object-[50%_25%] transition-transform duration-[950ms] ease-[var(--ease-out-expo)] hover:scale-[1.03]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-950/90 to-transparent" />
        {t.role && <p className="kicker kicker-plain absolute inset-x-0 bottom-4 justify-center text-yellow-400">{t.role}</p>}
      </div>
      <div className="p-6">
        <h3 className="h3 text-white">{t.name}</h3>
        {t.bio && <p className="mt-2 text-white/75">{t.bio}</p>}
        {t.specialization && <p className="mt-3 text-sm text-white/60"><b className="text-white/85">Specjalizacja:</b> {t.specialization}</p>}
        {t.levels?.length ? <p className="mt-1 text-sm text-white/60"><b className="text-white/85">Poziomy:</b> {t.levels.join(", ")}</p> : null}
        {t.experience && <p className="mt-1 text-sm text-white/60">{t.experience}</p>}
        <QuizCta location={`tutor_${t.slug}`} className="mt-6 w-full">Dopasuj mnie do korepetytora</QuizCta>
      </div>
    </article>
  );
}

export function Team() {
  return (
    <Chapter id="zespol" title={<>Ludzie, którzy pomogą<br />zrozumieć matematykę.</>} lead="Sprawdzony zespół korepetytorów i nauka dopasowana do ucznia.">
      <div className={`grid gap-4 ${tutors.length > 1 ? "sm:grid-cols-2 lg:grid-cols-3" : ""}`}>
        {tutors.map((t) => (
          <TutorCard key={t.slug} t={t} />
        ))}
      </div>
    </Chapter>
  );
}
