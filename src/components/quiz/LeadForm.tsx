"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icons";
import { BRAND, telHref } from "@/config/brand";
import { isMinorStudent, type QuizAnswers } from "@/data/quiz";
import { readAttribution } from "@/lib/ads/attribution";
import { track } from "@/lib/ads/track";
import { newLeadId } from "./capture";
import { HOURS, normalizePhone, validateContact, type ContactInput, type FieldErrors } from "@/lib/lead/schema";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "error"; message: string };

const EMPTY: ContactInput = { name: "", phone: "", email: "", message: "", adultOrGuardian: false, consent: false as unknown as true, marketing: false };

/**
 * FLIPOR lead form with the zdajmatme.com fields: name, phone, preferred hours, message, consent.
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
    setTouched({ name: true, phone: true, email: true, adultOrGuardian: true, consent: true });
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
          contact: values,
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
      aria-labelledby="lead-title"
    >
      <h4 id="lead-title" className="text-center text-[1.15rem] font-bold text-surface">
        Umów pierwszą lekcję próbną
      </h4>
      <p className="mt-1 text-center text-sm text-muted">{parent ? "Podaj dane rodzica lub opiekuna – zadzwonimy i ustalimy termin." : "Zadzwonimy i ustalimy termin pierwszej lekcji."}</p>

      <div className="mt-5 grid gap-4">
        {isMinorStudent(answers) && (
          <p className="rounded-xl bg-accent-soft px-4 py-3 text-sm font-medium text-surface">Poproś rodzica lub opiekuna o wpisanie jego danych – to z nim ustalimy szczegóły.</p>
        )}
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
        <fieldset>
          <legend className="field-label">Preferowane godziny lekcji (opcjonalnie)</legend>
          <div className="grid grid-cols-4 gap-2">
            {HOURS.map((h) => {
              const on = values.hours === h.value;
              return (
                <button
                  key={h.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => set("hours", on ? undefined : h.value)}
                  className={`min-h-12 rounded-[14px] border-[1.5px] px-1 text-[0.9rem] font-semibold tabular-nums transition-colors ${on ? "border-accent bg-accent text-night" : "border-line bg-white text-surface"}`}
                >
                  {h.label}
                </button>
              );
            })}
          </div>
        </fieldset>
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

      <button type="submit" disabled={busy} aria-busy={busy} className="btn btn-primary mt-6 w-full disabled:cursor-wait disabled:opacity-80">
        {busy ? (
          <>
            <span className="spinner" aria-hidden="true" /> Wysyłanie…
          </>
        ) : (
          <>
            Umów lekcję próbną <Icon name="arrow" size={18} />
          </>
        )}
      </button>
    </form>
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
