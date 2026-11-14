"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { QuizAnswers } from "@/config/quiz";
import { site } from "@/config/site";
import { getAttribution } from "@/lib/attribution";
import { CONTACT_LABELS, CONTACT_METHODS, FILLER_CONFIRM, allowedFillers, contactSchema, normalizePhone, type Filler } from "@/lib/lead-schema";
import { track, trackCall, trackLead } from "@/lib/tracking";
import { AlertIcon, ArrowRight, PhoneIcon, Spinner } from "../ui/Icons";

type Method = (typeof CONTACT_METHODS)[number];
interface Values {
  name: string;
  phone: string;
  email: string;
  contactMethod: Method;
  message: string;
  filler: Filler | "";
  fillerConfirm: boolean;
  privacyAccepted: boolean;
  marketingConsent: boolean;
}
type Errors = Partial<Record<keyof Values, string>>;

const uuid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16));

const ORDER: (keyof Values)[] = ["filler", "name", "phone", "email", "contactMethod", "message", "fillerConfirm", "privacyAccepted"];

const toPayload = (v: Values) => ({ ...v, filler: v.filler || undefined });

export function LeadForm({ answers, history, onSuccess }: { answers: QuizAnswers; history: { step: string; at: number; ms?: number }[]; onSuccess: (leadId: string) => void }) {
  const id = useId();
  const fillers = useMemo(() => allowedFillers(answers.who, answers.stage), [answers.who, answers.stage]);
  const [v, setV] = useState<Values>({
    name: "", phone: "", email: "", contactMethod: "phone", message: "",
    filler: fillers.length === 1 ? fillers[0] : "", fillerConfirm: false, privacyAccepted: false, marketingConsent: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [trap, setTrap] = useState("");
  const started = useRef(false);
  const mountedAt = useRef(Date.now());
  const idemKey = useRef(uuid());
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (fillers.length === 1) setV((s) => ({ ...s, filler: fillers[0] }));
  }, [fillers]);

  const parentContact = v.filler !== "adult_student";
  const phoneOk = v.phone.length > 0 && normalizePhone(v.phone) !== null;

  const fieldError = (key: keyof Values, values: Values) => {
    const r = contactSchema.safeParse(toPayload(values));
    return r.success ? undefined : r.error.issues.find((i) => i.path[0] === key)?.message;
  };

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    const next = { ...v, [key]: value };
    setV(next);
    if (errors[key] || (key === "contactMethod" && errors.email)) setErrors((e) => ({ ...e, [key]: fieldError(key, next), email: fieldError("email", next) }));
  };

  const blur = (key: "name" | "phone" | "email") => () => {
    if (v[key]) setErrors((e) => ({ ...e, [key]: fieldError(key, v) }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    const parsed = contactSchema.safeParse(toPayload(v));
    if (!parsed.success) {
      const errs: Errors = {};
      for (const i of parsed.error.issues) errs[i.path[0] as keyof Values] ??= i.message;
      setErrors(errs);
      const first = ORDER.find((k) => errs[k]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setServerError("");
    setStatus("submitting");
    track("lead_form_submit");
    const body = JSON.stringify({ idempotencyKey: idemKey.current, contact: parsed.data, quiz: answers, attribution: getAttribution(), history, hp: trap, startedAt: mountedAt.current });
    const post = () => fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body, signal: AbortSignal.timeout(25_000) });
    try {
      let res = await post();
      if (res.status === 409) {
        await new Promise((r) => setTimeout(r, 1500));
        res = await post();
      }
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; leadId?: string; error?: string; fieldErrors?: Errors };
      if (res.ok && data.ok && data.leadId) {
        await trackLead(data.leadId, { email: parsed.data.email || undefined, phoneE164: normalizePhone(parsed.data.phone)! }).catch(() => {});
        onSuccess(data.leadId);
        return;
      }
      if (data.fieldErrors) setErrors(data.fieldErrors);
      setServerError(data.error || "Nie udało się wysłać zgłoszenia.");
      setStatus("error");
    } catch {
      setServerError("Brak połączenia z internetem lub serwer nie odpowiada.");
      setStatus("error");
    }
  }

  const err = (k: keyof Values) => (errors[k] ? <p id={`${id}-${k}-e`} className="field-error" role="alert">{errors[k]}</p> : null);
  const aria = (k: keyof Values) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${id}-${k}-e` : undefined, "data-field": k });
  const pill = (on: boolean) => `flex min-h-12 cursor-pointer items-center justify-center rounded-[14px] px-2 text-center text-sm font-semibold transition-colors ${on ? "bg-ink text-white" : "bg-white text-ink shadow-[inset_0_0_0_1.5px_var(--color-line)]"}`;
  const check = "mt-0.5 h-5 w-5 shrink-0 accent-[#061a32]";

  return (
    <form ref={formRef} noValidate onSubmit={submit} onFocus={() => { if (!started.current) { started.current = true; track("lead_form_start"); } }} className="space-y-4">
      {fillers.length > 1 && (
        <fieldset>
          <legend className="field-label">Ile masz lat?</legend>
          <div className="grid grid-cols-2 gap-2">
            {fillers.map((f, i) => (
              <label key={f} className={pill(v.filler === f)}>
                <input type="radio" name="filler" className="sr-only" checked={v.filler === f} onChange={() => set("filler", f)} {...(i === 0 ? aria("filler") : {})} />
                {f === "adult_student" ? "18 lat lub więcej" : "Mniej niż 18 lat"}
              </label>
            ))}
          </div>
          {err("filler")}
        </fieldset>
      )}
      {v.filler === "guardian_of_minor" && (
        <p className="rounded-[14px] bg-yellow-400/20 px-4 py-3 text-sm font-semibold text-ink">
          Poproś rodzica lub opiekuna o podanie jego danych — to z nim {site.owner.firstName} omówi zajęcia.
        </p>
      )}

      <div>
        <label htmlFor={`${id}-name`} className="field-label">{parentContact ? "Imię rodzica / opiekuna" : "Twoje imię"} *</label>
        <input id={`${id}-name`} className="field" type="text" autoComplete="given-name" maxLength={60} value={v.name} onChange={(e) => set("name", e.target.value)} onBlur={blur("name")} {...aria("name")} />
        {err("name")}
      </div>

      <div>
        <label htmlFor={`${id}-phone`} className="field-label">Telefon *</label>
        <input id={`${id}-phone`} className="field" type="tel" inputMode="tel" autoComplete="tel" maxLength={22} placeholder="600 123 456" value={v.phone} onChange={(e) => set("phone", e.target.value)} onBlur={blur("phone")} {...aria("phone")} />
        {err("phone") ?? (phoneOk ? <p className="field-ok">✓ Poprawny numer</p> : null)}
      </div>

      <div>
        <label htmlFor={`${id}-email`} className="field-label">
          E-mail <span className="font-normal text-muted">{v.contactMethod === "email" ? "*" : "(opcjonalnie)"}</span>
        </label>
        <input id={`${id}-email`} className="field" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={120} value={v.email} onChange={(e) => set("email", e.target.value)} onBlur={blur("email")} {...aria("email")} />
        {err("email")}
      </div>

      <fieldset>
        <legend className="field-label">Preferowany kontakt</legend>
        <div className="grid grid-cols-3 gap-2">
          {CONTACT_METHODS.map((c, i) => (
            <label key={c} className={pill(v.contactMethod === c)}>
              <input type="radio" name="contactMethod" className="sr-only" checked={v.contactMethod === c} onChange={() => set("contactMethod", c)} {...(i === 0 ? aria("contactMethod") : {})} />
              {CONTACT_LABELS[c]}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={`${id}-msg`} className="field-label">
          Dodatkowe informacje <span className="font-normal text-muted">(opcjonalnie)</span>
        </label>
        <textarea id={`${id}-msg`} className="field min-h-20 resize-y" rows={2} maxLength={1000} placeholder="Np. dogodne dni, termin sprawdzianu" value={v.message} onChange={(e) => set("message", e.target.value)} {...aria("message")} />
        {err("message")}
      </div>

      {/* honeypot: neutral name so browsers never autofill it (no "company"/"firma") */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input tabIndex={-1} autoComplete="off" name="zm_trap_8q" value={trap} onChange={(e) => setTrap(e.target.value)} />
      </div>

      <div className="space-y-3 text-[0.95rem] leading-snug">
        {v.filler && (
          <label className="flex cursor-pointer gap-3 text-ink">
            <input type="checkbox" className={check} checked={v.fillerConfirm} onChange={(e) => set("fillerConfirm", e.target.checked)} {...aria("fillerConfirm")} />
            <span>{FILLER_CONFIRM[v.filler]} *</span>
          </label>
        )}
        {err("fillerConfirm")}
        <label className="flex cursor-pointer gap-3 text-ink">
          <input type="checkbox" className={check} checked={v.privacyAccepted} onChange={(e) => set("privacyAccepted", e.target.checked)} {...aria("privacyAccepted")} />
          <span>
            Zapoznałem(-am) się z{" "}
            <a href="/polityka-prywatnosci" target="_blank" className="font-semibold underline underline-offset-2">polityką prywatności</a>. Dane posłużą wyłącznie do obsługi zgłoszenia. *
          </span>
        </label>
        {err("privacyAccepted")}
        <label className="flex cursor-pointer gap-3 text-muted">
          <input type="checkbox" className={check} checked={v.marketingConsent} onChange={(e) => set("marketingConsent", e.target.checked)} />
          <span>(Opcjonalnie) Chcę otrzymywać informacje o ofercie e-mailem lub SMS-em. Zgodę mogę wycofać w każdej chwili.</span>
        </label>
      </div>

      {status === "error" && serverError && (
        <div role="alert" className="flex gap-3 rounded-[16px] bg-[#fef2f2] p-4 text-sm text-[#7f1d1d] shadow-[inset_0_0_0_1.5px_#fecaca]">
          <AlertIcon className="mt-0.5 shrink-0" />
          <div>
            <p className="font-bold">Wysłanie nie powiodło się.</p>
            <p className="mt-1">{serverError} Twoje dane zostały zachowane.</p>
            <a href={site.phone.href} onClick={() => trackCall("form_error")} className="mt-2 inline-flex min-h-12 items-center gap-1.5 font-bold underline underline-offset-2">
              <PhoneIcon className="h-4 w-4" /> Zadzwoń: {site.phone.display}
            </a>
          </div>
        </div>
      )}

      <button type="submit" className="btn btn-primary w-full" disabled={status === "submitting"} aria-busy={status === "submitting"}>
        {status === "submitting" ? (<><Spinner /> Wysyłanie…</>) : (<>Dopasuj korepetytora <ArrowRight className="arrow" /></>)}
      </button>
    </form>
  );
}
