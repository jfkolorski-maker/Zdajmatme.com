"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { tutors, type Tutor } from "@/config/tutors";
import { track } from "@/lib/tracking";
import { QuizCta } from "../ui/Cta";
import { Reveal } from "../ui/Reveal";
import { Chapter } from "../ui/Chapter";

/** Fires tutor_profile_view once when ≥60% of the card is visible. */
function useProfileView(slug: string) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          track("tutor_profile_view", { tutor_slug: slug });
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [slug]);
  return ref;
}

function Meta({ t }: { t: Tutor }) {
  return (
    <dl className="mt-5 space-y-3 text-[0.9375rem]">
      {t.specialization && (
        <div>
          <dt className="text-[0.8125rem] font-bold uppercase tracking-wider text-text-3">Specjalizacja</dt>
          <dd className="font-semibold">{t.specialization}</dd>
        </div>
      )}
      {t.levels?.length ? (
        <div>
          <dt className="text-[0.8125rem] font-bold uppercase tracking-wider text-text-3">Poziomy</dt>
          <dd className="mt-1 flex flex-wrap gap-1.5">
            {t.levels.map((l) => (
              <span key={l} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-sm font-semibold ring-1 ring-white/10">
                {l}
              </span>
            ))}
          </dd>
        </div>
      ) : null}
      {t.experience && (
        <div>
          <dt className="text-[0.8125rem] font-bold uppercase tracking-wider text-text-3">Doświadczenie</dt>
          <dd className="text-text-2">{t.experience}</dd>
        </div>
      )}
    </dl>
  );
}

function FeaturedCard({ t }: { t: Tutor }) {
  const ref = useProfileView(t.slug);
  return (
    <article ref={ref} className="group grid overflow-hidden rounded-[2rem] bg-surface shadow-[var(--shadow-lift)] ring-1 ring-white/10 md:grid-cols-[0.95fr_1.05fr]">
      <div className="relative aspect-[4/5] overflow-hidden md:aspect-auto md:min-h-[32rem]">
        <Image
          src={t.photo.src}
          alt={t.photo.alt}
          fill
          sizes="(min-width: 768px) 40vw, 100vw"
          className="object-cover object-[50%_28%] transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-10">
        {t.role && <p className="eyebrow w-fit rounded-full bg-yellow-400 px-3 py-1 text-navy-950">{t.role}</p>}
        <h3 className="h-card mt-4 !text-3xl">{t.name}</h3>
        {t.bio && <p className="mt-3 text-lg leading-relaxed text-text-2">{t.bio}</p>}
        <Meta t={t} />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <QuizCta location={`tutor_${t.slug}`}>Dopasuj mnie do korepetytora</QuizCta>
        </div>
      </div>
    </article>
  );
}

function TutorCard({ t }: { t: Tutor }) {
  const ref = useProfileView(t.slug);
  return (
    <article ref={ref} className="group overflow-hidden rounded-[var(--radius-card)] bg-surface ring-1 ring-white/10 transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image src={t.photo.src} alt={t.photo.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]" />
      </div>
      <div className="p-6">
        <h3 className="h-card">{t.name}</h3>
        {t.bio && <p className="mt-2 text-text-2">{t.bio}</p>}
        <Meta t={t} />
        <QuizCta location={`tutor_${t.slug}`} variant="ghost-light" className="mt-6 w-full">
          Dopasuj mnie do korepetytora
        </QuizCta>
      </div>
    </article>
  );
}

export function Team() {
  const featured = tutors.filter((t) => t.featured);
  const others = tutors.filter((t) => !t.featured);
  return (
    <Chapter
      id="zespol"
      titleText="Poznaj ludzi, którzy pomogą Ci zrozumieć matematykę."
      title="Poznaj ludzi, którzy pomogą Ci zrozumieć matematykę."
      lead="Sprawdzony zespół korepetytorów, indywidualne podejście i nauka dopasowana do potrzeb ucznia."
    >
      <div className="space-y-6">
        {featured.map((t) => (
          <Reveal key={t.slug}>
            <FeaturedCard t={t} />
          </Reveal>
        ))}
        {others.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((t, i) => (
              <Reveal key={t.slug} delay={i * 0.06}>
                <TutorCard t={t} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </Chapter>
  );
}
