"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { m, AnimatePresence } from "motion/react";
import type { QuizAnswers } from "@/config/quiz";
import { site } from "@/config/site";
import { getAttribution } from "@/lib/attribution";
import {
  CONTACT_LABELS,
  CONTACT_METHODS,
  FILLER_CONFIRM,
  allowedFillers,
  contactSchema,
  normalizePhone,
  type Filler,
} from "@/lib/lead-schema";
import { track, trackCall, trackLead } from "@/lib/tracking";
import { AlertIcon, ArrowRight, PhoneIcon, Spinner } from "../ui/Icons";

type Method = (typeof CONTACT_METHODS)[number];
interface Values {
  name: string;
  phone: string;
  email: string;
  contactMethod: Method | "";
  message: string;
  filler: Filler | "";
  fillerConfirm: boolean;
  marketingConsent: boolean;
}
type Errors = Partial<Record<keyof Values, string>>;

const uuid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
        (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16),
      );

const FIELD_ORDER: (keyof Values)[] = ["filler", "name", "phone", "email", "contactMethod", "message", "fillerConfirm"];

export function LeadForm({
  answers,
  history,
  onSuccess,
}: {
  answers: QuizAnswers;
  history: { step: string; at: number; ms?: number }[];
  onSuccess: (leadId: string) => void;
}) {
  const id = useId();
  const fillers = useMemo(() => allowedFillers(answers.who, answers.stage), [answers.who, answers.stage]);
  const [v, setV] = useState<Values>({
    name: "",
    phone: "",
    email: "",
    contactMethod: "phone",
    message: "",
    filler: fillers.length === 1 ? fillers[0] : "",
    fillerConfirm: false,
    marketingConsent: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [hp, setHp] = useState("");
  const startedForm = useRef(false);
  const mountedAt = useRef(Date.now());
  const idemKey = useRef(uuid());
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (fillers.length === 1) setV((s) => ({ ...s, filler: fillers[0] }));
  }, [fillers]);

  const isParentContact = v.filler !== "adult_student";
  const nameLabel = isParentContact ? "Imię rodzica / opiekuna" : "Twoje imię";

  const validateField = (key: keyof Values, values: Values) => {
    const r = contactSchema.safeParse(toPayload(values));
    if (r.success) return undefined;
    return r.error.issues.find((i) => i.path[0] === key)?.message;
  };

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setV((s) => {
      const next = { ...s, [key]: value };
      if (errors[key]) setErrors((e) => ({ ...e, [key]: validateField(key, next) }));
      return next;
    });
  };

  const onFocusAny = () => {
    if (startedForm.current) return;
    startedForm.current = true;
    track("lead_form_start");
  };

  const onBlur = (key: keyof Values) => () => {
    if (key === "name" || key === "phone" || key === "email") {
      if (!v[key]) return; // don't nag on empty fields until submit
      setErrors((e) => ({ ...e, [key]: validateField(key, v) }));
    }
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return; // double-submit guard
    const parsed = contactSchema.safeParse(toPayload(v));
    if (!parsed.success) {
      const errs: Errors = {};
      for (const i of parsed.error.issues) errs[i.path[0] as keyof Values] ??= i.message;
      setErrors(errs);
      const first = FIELD_ORDER.find((k) => errs[k]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setServerError("");
    setStatus("submitting");
    track("lead_form_submit");

    const body = JSON.stringify({
      idempotencyKey: idemKey.current,
      contact: parsed.data,
      quiz: answers,
      attribution: getAttribution(),
      history,
      hp,
      startedAt: mountedAt.current,
    });

    try {
      let res = await post(body);
      if (res.status === 409) {
        await new Promise((r) => setTimeout(r, 1500));
        res = await post(body);
      }
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; leadId?: string; error?: string; fieldErrors?: Errors };
      if (res.ok && data.ok && data.leadId) {
        await trackLead(data.leadId, { email: parsed.data.email, phoneE164: normalizePhone(parsed.data.phone)! }).catch(() => {});
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

  const err = (k: keyof Values) =>
    errors[k] ? (
      <p id={`${id}-${k}-err`} className="field-error" role="alert">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof Values) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${id}-${k}-err` : undefined, "data-field": k });

  return (
    <form ref={formRef} noValidate onSubmit={submit} onFocus={onFocusAny} className="text-white" aria-describedby={`${id}-desc`}>
      <h3 className="text-2xl font-extrabold sm:text-[1.75rem] sm:leading-tight">Porozmawiajmy o korepetycjach dla ucznia.</h3>
      <p id={`${id}-desc`} className="mt-2 text-white/70">
        {site.owner.firstName} skontaktuje się z Tobą, aby omówić potrzeby ucznia i dopasować odpowiednie zajęcia.
      </p>

      <div className="mt-6 space-y-5 [&_.field-label]:text-white [&_.field-error]:text-[#ffb59a]">
        {fillers.length > 1 && (
          <fieldset>
            <legend className="field-label">Ile masz lat?</legend>
            <div className="grid grid-cols-2 gap-2" role="radiogroup">
              {fillers.map((f) => (
                <label key={f} className={`flex min-h-12 cursor-pointer items-center justify-center rounded-xl px-3 text-center text-sm font-bold ring-1 transition ${v.filler === f ? "bg-yellow-400 text-navy-950 ring-yellow-400" : "bg-white/[0.05] ring-white/15 hover:ring-white/40"}`}>
                  <input type="radio" name="filler" value={f} checked={v.filler === f} onChange={() => set("filler", f)} className="sr-only" {...(f === fillers[0] ? aria("filler") : {})} />
                  {f === "adult_student" ? "Mam ukończone 18 lat" : "Mam mniej niż 18 lat"}
                </label>
              ))}
            </div>
            {err("filler")}
          </fieldset>
        )}

        <AnimatePresence>
          {v.filler === "guardian_of_minor" && (
            <m.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden rounded-xl bg-yellow-400/10 px-4 py-3 text-sm font-semibold text-yellow-100 ring-1 ring-yellow-400/30">
              Poproś rodzica lub opiekuna o wypełnienie danych poniżej — to z nim {site.owner.firstName} omówi szczegóły zajęć.
            </m.p>
          )}
        </AnimatePresence>

        <div>
          <label htmlFor={`${id}-name`} className="field-label">{nameLabel}</label>
          <input id={`${id}-name`} className="field" type="text" autoComplete="given-name" maxLength={60} value={v.name} onChange={(e) => set("name", e.target.value)} onBlur={onBlur("name")} placeholder="np. Anna" {...aria("name")} />
          {err("name")}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-phone`} className="field-label">Numer telefonu</label>
            <input id={`${id}-phone`} className="field" type="tel" inputMode="tel" autoComplete="tel" maxLength={22} value={v.phone} onChange={(e) => set("phone", e.target.value)} onBlur={onBlur("phone")} placeholder="600 123 456" {...aria("phone")} />
            {err("phone")}
          </div>
          <div>
            <label htmlFor={`${id}-email`} className="field-label">Adres e-mail</label>
            <input id={`${id}-email`} className="field" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={120} value={v.email} onChange={(e) => set("email", e.target.value)} onBlur={onBlur("email")} placeholder="anna@przyklad.pl" {...aria("email")} />
            {err("email")}
          </div>
        </div>

        <fieldset>
          <legend className="field-label">Preferowana forma kontaktu</legend>
          <div className="grid grid-cols-3 gap-2" role="radiogroup">
            {CONTACT_METHODS.map((c) => (
              <label key={c} className={`flex min-h-12 cursor-pointer items-center justify-center rounded-xl text-sm font-bold ring-1 transition ${v.contactMethod === c ? "bg-yellow-400 text-navy-950 ring-yellow-400" : "bg-white/[0.05] ring-white/15 hover:ring-white/40"}`}>
                <input type="radio" name="contactMethod" value={c} checked={v.contactMethod === c} onChange={() => set("contactMethod", c)} className="sr-only" {...(c === "phone" ? aria("contactMethod") : {})} />
                {CONTACT_LABELS[c]}
              </label>
            ))}
          </div>
          {err("contactMethod")}
        </fieldset>

        <div>
          <label htmlFor={`${id}-msg`} className="field-label">
            Wiadomość <span className="font-medium text-white/50">(opcjonalnie)</span>
          </label>
          <textarea id={`${id}-msg`} className="field min-h-24 resize-y" maxLength={1000} rows={3} value={v.message} onChange={(e) => set("message", e.target.value)} placeholder="Np. dogodne dni i godziny, termin sprawdzianu…" {...aria("message")} />
          {err("message")}
        </div>

        {/* honeypot – invisible to people, attractive to bots */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Firma
            <input tabIndex={-1} autoComplete="off" name="company" value={hp} onChange={(e) => setHp(e.target.value)} />
          </label>
        </div>

        <div className="space-y-3 rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
          {v.filler && (
            <label className="flex cursor-pointer gap-3 text-sm leading-relaxed">
              <input type="checkbox" checked={v.fillerConfirm} onChange={(e) => set("fillerConfirm", e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-yellow-400" {...aria("fillerConfirm")} />
              <span>
                {FILLER_CONFIRM[v.filler]} <span className="text-yellow-400">*</span>
              </span>
            </label>
          )}
          {err("fillerConfirm")}
          <label className="flex cursor-pointer gap-3 text-sm leading-relaxed text-white/80">
            <input type="checkbox" checked={v.marketingConsent} onChange={(e) => set("marketingConsent", e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-yellow-400" />
            <span>
              <span className="font-semibold text-white">(Opcjonalnie)</span> Chcę otrzymywać od {site.name} informacje o ofercie e-mailem lub SMS-em. Zgodę mogę wycofać w każdej chwili.
            </span>
          </label>
          <p className="text-[0.8125rem] leading-relaxed text-white/55">
            Administratorem danych jest {site.name}. Dane z formularza przetwarzamy wyłącznie w celu obsługi zgłoszenia i kontaktu w sprawie korepetycji
            (art. 6 ust. 1 lit. b RODO). Szczegóły i Twoje prawa:{" "}
            <a href="/polityka-prywatnosci" target="_blank" className="font-semibold text-white underline underline-offset-2">
              polityka prywatności
            </a>
            .
          </p>
        </div>

        <AnimatePresence>
          {status === "error" && serverError && (
            <m.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="flex gap-3 rounded-2xl bg-[#c4320a]/15 p-4 text-sm ring-1 ring-[#ff8a65]/40">
              <AlertIcon className="mt-0.5 shrink-0 text-[#ffb59a]" />
              <div>
                <p className="font-bold">Wysłanie nie powiodło się.</p>
                <p className="mt-1 text-white/80">{serverError} Twoje dane zostały zachowane w formularzu.</p>
                <a href={site.phone.href} onClick={() => trackCall("form_error")} className="mt-2 inline-flex items-center gap-1.5 font-bold text-yellow-400 underline underline-offset-2">
                  <PhoneIcon className="h-4 w-4" /> Zadzwoń: {site.phone.display}
                </a>
              </div>
            </m.div>
          )}
        </AnimatePresence>

        <button type="submit" className="btn btn-primary w-full text-[1.05rem]" disabled={status === "submitting"} aria-busy={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <Spinner /> Wysyłanie…
            </>
          ) : (
            <>
              Dopasuj korepetytora <ArrowRight className="arrow" />
            </>
          )}
        </button>
        <p className="text-center text-[0.8125rem] text-white/50">Bez opłat za zgłoszenie i bez zakładania konta.</p>
      </div>
    </form>
  );
}

function post(body: string) {
  return fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body });
}

function toPayload(v: Values) {
  return {
    name: v.name,
    phone: v.phone,
    email: v.email,
    contactMethod: v.contactMethod || undefined,
    message: v.message,
    filler: v.filler || undefined,
    fillerConfirm: v.fillerConfirm,
    marketingConsent: v.marketingConsent,
  };
}
