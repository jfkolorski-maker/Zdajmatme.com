"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icons";
import { BRAND, telHref } from "@/config/brand";
import { HOUR_MAX, HOUR_MIN, SCHOOL_YEAR, coursesFor, hourLabel, hoursLabel, isCourseOffer, isMinorStudent, type QuizAnswers } from "@/data/quiz";
import { readAttribution } from "@/lib/ads/attribution";
import { track } from "@/lib/ads/track";
import { newLeadId } from "./capture";
import { normalizePhone, validateContact, type ContactInput, type FieldErrors } from "@/lib/lead/schema";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "error"; message: string };

const EMPTY: ContactInput = { name: "", phone: "", email: "", firstDate: "", hoursFrom: HOUR_MIN, hoursTo: HOUR_MAX, message: "", adultOrGuardian: false, consent: false as unknown as true, marketing: false };

/**
 * Lead form: first name, phone, e-mail (optional).
 * – Courses: no date / hour picking – the fixed day and time are shown, the button enrols for the school year.
 * – 1:1 lessons: a calendar for the first lesson and an hour range slider ("od – do").
 * A minor never leaves their own data – then the labels ask for the parent / guardian.
 */
export function LeadForm({ answers, onSent }: { answers: QuizAnswers; onSent: () => void }) {
  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactInput, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  // One id per lead – retries reuse it, so the CRM never stores the same lead twice.
  const submissionId = useRef(newLeadId());
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const started = useRef(false);
  const parent = answers.who !== "self" || isMinorStudent(answers);
  const self = answers.who === "self";
  const course = isCourseOffer(answers);

  const set = <K extends keyof ContactInput>(k: K, v: ContactInput[K]) => {
    const next = { ...values, [k]: v };
    setValues(next);
    if (touched[k]) setErrors(validateContact(next, answers));
  };
  const blur = (k: keyof ContactInput) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validateContact(values, answers));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status.kind === "sending") return;
    const found = validateContact(values, answers);
    setErrors(found);
    setTouched({ name: true, phone: true, email: true, firstDate: true, hoursTo: true, adultOrGuardian: true, consent: true });
    if (Object.keys(found).length) {
      formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const attribution = readAttribution();
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: submissionId.current,
          // courses have a fixed schedule – no date / hours are sent
          contact: course ? { ...values, firstDate: "", hoursFrom: undefined, hoursTo: undefined } : values,
          answers,
          company: honeypot.current?.value ?? "",
          pageUrl: window.location.href,
          attribution: attribution ? Object.fromEntries(Object.entries(attribution).filter(([, v]) => typeof v === "string" && v)) : undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Nie udało się wysłać zgłoszenia.");
      track({ name: "lead_submit", transactionId: submissionId.current });
      onSent();
    } catch (err) {
      const msg = err instanceof Error && err.message !== "Failed to fetch" ? err.message : "Brak połączenia z internetem.";
      setStatus({ kind: "error", message: msg });
    }
  };

  const show = (k: keyof ContactInput) => (touched[k] ? errors[k] : undefined);
  const phoneOk = values.phone ? normalizePhone(values.phone) : null;
  const busy = status.kind === "sending";

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      onFocus={() => {
        if (!started.current) {
          started.current = true;
          track({ name: "lead_form_start" });
        }
      }}
      noValidate
      aria-label={parent ? "Dane rodzica lub opiekuna" : "Twoje dane kontaktowe"}
    >

      <div className="grid gap-4">
        {isMinorStudent(answers) && (
          <p className="rounded-xl bg-accent-soft px-4 py-3 text-sm font-medium text-surface">Poproś rodzica lub opiekuna o wpisanie jego danych – to z nim ustalimy szczegóły.</p>
        )}
        {course && <CourseBox answers={answers} />}
        <Field label={parent ? "Imię rodzica lub opiekuna" : "Imię"} name="name" placeholder="np. Anna" autoComplete="given-name" value={values.name} error={show("name")} onChange={(v) => set("name", v)} onBlur={() => blur("name")} required />
        <Field
          label="Numer telefonu"
          name="phone"
          type="tel"
          inputMode="tel"
          placeholder="np. 730 170 804"
          autoComplete="tel"
          value={values.phone}
          error={show("phone")}
          hint={phoneOk ? "✓ Poprawny numer" : undefined}
          onChange={(v) => set("phone", v)}
          onBlur={() => blur("phone")}
          required
        />
        <Field label="E-mail (opcjonalnie)" name="email" type="email" inputMode="email" autoComplete="email" value={values.email ?? ""} error={show("email")} onChange={(v) => set("email", v)} onBlur={() => blur("email")} />
        {!course && (
          <>
            <DateField value={values.firstDate ?? ""} error={show("firstDate")} onChange={(v) => set("firstDate", v)} onBlur={() => blur("firstDate")} />
            <HourRange
              from={values.hoursFrom ?? HOUR_MIN}
              to={values.hoursTo ?? HOUR_MAX}
              onChange={(f, t) => {
                const next = { ...values, hoursFrom: f, hoursTo: t };
                setValues(next);
              }}
            />
          </>
        )}
        <Field label="Twoja wiadomość (opcjonalnie)" name="message" placeholder="Opisz, jak możemy Ci pomóc…" multiline value={values.message ?? ""} error={show("message")} onChange={(v) => set("message", v)} onBlur={() => blur("message")} />
      </div>

      {/* Honeypot – hidden from people and assistive tech. Neutral name: browsers must never autofill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Nie wypełniaj
          <input ref={honeypot} type="text" name="hp_x7q" tabIndex={-1} autoComplete="off" data-lpignore="true" data-1p-ignore defaultValue="" />
        </label>
      </div>

      {self && (
        <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-surface">
          <input type="checkbox" name="adultOrGuardian" checked={Boolean(values.adultOrGuardian)} onChange={(e) => set("adultOrGuardian", e.target.checked)} onBlur={() => blur("adultOrGuardian")} className="mt-0.5 h-5 w-5 shrink-0 accent-[#212121]" aria-invalid={Boolean(show("adultOrGuardian"))} />
          <span>
            {isMinorStudent(answers) ? "Dane kontaktowe należą do mojego rodzica lub opiekuna, który wie o zgłoszeniu." : "Mam ukończone 18 lat albo dane podaje mój rodzic lub opiekun."} <span className="text-accent">*</span>
          </span>
        </label>
      )}
      {show("adultOrGuardian") && <p className="field-error">{errors.adultOrGuardian}</p>}

      <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted">
        <input
          type="checkbox"
          name="consent"
          checked={Boolean(values.consent)}
          onChange={(e) => set("consent", e.target.checked as true)}
          onBlur={() => blur("consent")}
          className="mt-0.5 h-5 w-5 shrink-0 accent-[#212121]"
          aria-invalid={Boolean(show("consent"))}
          aria-describedby={show("consent") ? "consent-err" : undefined}
        />
        <span>
          Wyrażam zgodę na przetwarzanie danych w celu obsługi zgłoszenia (
          <a href={BRAND.privacyUrl} target="_blank" className="font-semibold text-surface underline underline-offset-2">
            Polityka prywatności
          </a>
          ). <span className="text-accent">*</span>
        </span>
      </label>
      {show("consent") && (
        <p id="consent-err" className="field-error">
          {errors.consent}
        </p>
      )}
      <label className="mt-3 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted">
        <input type="checkbox" name="marketing" checked={Boolean(values.marketing)} onChange={(e) => set("marketing", e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#212121]" />
        <span>(Opcjonalnie) Chcę otrzymywać informacje o ofercie e-mailem lub SMS-em. Zgodę mogę wycofać w każdej chwili.</span>
      </label>

      {status.kind === "error" && (
        <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {status.message} Możesz też zadzwonić:{" "}
          <a href={telHref()} onClick={() => track({ name: "phone_click", placement: "form_error" })} className="font-bold underline">
            {BRAND.phone}
          </a>
        </p>
      )}

      <button type="submit" disabled={busy} aria-busy={busy} className="btn btn-primary mt-6 w-full !whitespace-normal disabled:cursor-wait disabled:opacity-80">
        {busy ? (
          <>
            <span className="spinner" aria-hidden="true" /> Wysyłanie…
          </>
        ) : (
          <>
            {course ? `Zapisz się na kurs ${SCHOOL_YEAR}` : "Umów pierwszą lekcję"} <Icon name="arrow" size={18} />
          </>
        )}
      </button>
    </form>
  );
}

/** Courses: the fixed day and time instead of any date / hour picking. */
function CourseBox({ answers }: { answers: QuizAnswers }) {
  const list = coursesFor(answers);
  return (
    <div className="rounded-[18px] border-2 border-accent bg-white px-4 py-4 text-surface">
      <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-accent">Zapis na kurs · rok szkolny {SCHOOL_YEAR}</p>
      <ul className="mt-2.5 space-y-2.5">
        {list.map((c) => (
          <li key={c.name} className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-accent-soft text-accent">
              <Icon name="calendar" size={20} />
            </span>
            <span className="leading-snug">
              {list.length > 1 && <span className="block text-[0.8rem] text-muted">{c.name.replace("Kurs maturalny · ", "")}</span>}
              <span className="block text-[1.05rem] font-bold">
                {c.day}, godz. {c.time}
              </span>
              <span className="block text-[0.85rem] text-muted">{c.length} · online na Teams</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 border-t border-line pt-2.5 text-[0.82rem] text-muted">
        {list.length > 1 ? "Poziom potwierdzimy w rozmowie. " : ""}Termin jest stały – nie musisz nic wybierać.
      </p>
    </div>
  );
}

const WEEKDAY = new Intl.DateTimeFormat("pl-PL", { weekday: "long", day: "numeric", month: "long" });
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const isoLocal = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** 1:1 lessons: calendar for the first lesson (native date picker – the phone's own calendar). */
function DateField({ value, error, onChange, onBlur }: { value: string; error?: string; onChange: (v: string) => void; onBlur: () => void }) {
  const id = useId();
  const today = new Date();
  const max = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
  const picked = value ? new Date(`${value}T12:00:00`) : null;
  return (
    <div>
      <label htmlFor={id} className="field-label">
        Data pierwszej lekcji
      </label>
      <div className="relative">
        <Icon name="calendar" size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-accent" />
        <input
          id={id}
          name="firstDate"
          type="date"
          min={isoLocal(today)}
          max={isoLocal(max)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          className={`field-input !pl-12 ${error ? "has-error" : ""}`}
        />
      </div>
      {error ? (
        <p className="field-error">{error}</p>
      ) : (
        <p className="mt-1.5 text-sm text-muted">{picked ? <span className="font-semibold text-surface">{cap(WEEKDAY.format(picked))}</span> : "Wybierz dzień w kalendarzu – potwierdzimy go telefonicznie."}</p>
      )}
    </div>
  );
}

/** 1:1 lessons: two-handle slider – the earliest and the latest hour that suits. */
function HourRange({ from, to, onChange }: { from: number; to: number; onChange: (from: number, to: number) => void }) {
  const span = HOUR_MAX - HOUR_MIN;
  const pct = (h: number) => ((h - HOUR_MIN) / span) * 100;
  const label = hoursLabel(from, to);
  return (
    <fieldset>
      <legend className="field-label flex w-full items-baseline justify-between gap-3">
        <span>Godziny zajęć</span>
        <span className="rounded-full bg-accent px-3 py-1 text-[0.85rem] font-bold tabular-nums text-night">{label === "Dowolna pora" ? "Dowolna pora" : `od ${hourLabel(from)} do ${hourLabel(to)}`}</span>
      </legend>
      <div className="range2 relative mt-3 h-10">
        <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-line" />
        <div className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-accent" style={{ left: `${pct(from)}%`, right: `${100 - pct(to)}%` }} />
        <input
          type="range"
          aria-label="Najwcześniej od godziny"
          aria-valuetext={hourLabel(from)}
          min={HOUR_MIN}
          max={HOUR_MAX}
          step={1}
          value={from}
          onChange={(e) => onChange(Math.min(Number(e.target.value), to - 1), to)}
        />
        <input
          type="range"
          aria-label="Najpóźniej do godziny"
          aria-valuetext={hourLabel(to)}
          min={HOUR_MIN}
          max={HOUR_MAX}
          step={1}
          value={to}
          onChange={(e) => onChange(from, Math.max(Number(e.target.value), from + 1))}
        />
      </div>
      <div className="mt-1 flex justify-between text-[0.75rem] tabular-nums text-muted" aria-hidden="true">
        {[7, 10, 13, 16, 19, 22].map((h) => (
          <span key={h}>{h}:00</span>
        ))}
      </div>
      <p className="mt-1.5 text-sm text-muted">Przesuń kropki: od której najwcześniej i do której najpóźniej.</p>
    </fieldset>
  );
}

interface FieldProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  hint?: string;
  type?: string;
  placeholder?: string;
  inputMode?: "tel" | "email" | "text" | "numeric";
  autoComplete?: string;
  multiline?: boolean;
  required?: boolean;
  onChange: (v: string) => void;
  onBlur: () => void;
}

function Field({ label, name, value, error, hint, type = "text", placeholder, inputMode, autoComplete, multiline, required, onChange, onBlur }: FieldProps) {
  const id = useId();
  const described = error ? `${id}-e` : hint ? `${id}-h` : undefined;
  const common = {
    id,
    name,
    value,
    placeholder,
    onBlur,
    "aria-invalid": Boolean(error),
    "aria-describedby": described,
    "aria-required": required,
    className: `field-input ${error ? "has-error" : ""}`,
  };
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      {multiline ? (
        <textarea {...common} rows={3} maxLength={1500} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...common} type={type} inputMode={inputMode} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} />
      )}
      {error ? (
        <p id={`${id}-e`} className="field-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-h`} className="mt-1.5 text-sm text-emerald-700">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
