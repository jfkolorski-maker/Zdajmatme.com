import type { LeadRecord } from "../crm/types";
import { site } from "@/config/site";

/**
 * Optional e-mail notifications via Resend (https://resend.com).
 * Nothing is sent unless RESEND_API_KEY and EMAIL_FROM are configured.
 * Failures are logged and NEVER affect the lead result (the CRM write is the source of truth).
 *
 *  LEAD_NOTIFY_EMAIL           – internal notification to Oliwia (new lead)
 *  SEND_CONFIRMATION_EMAIL=true – confirmation to the person who submitted the form
 */
async function send(to: string, subject: string, text: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, text }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("[notify] email HTTP", res.status);
  } catch (e) {
    console.error("[notify] email failed", (e as Error).message);
  }
}

export async function notifyLead(lead: LeadRecord) {
  const jobs: Promise<void>[] = [];
  if (process.env.LEAD_NOTIFY_EMAIL) {
    jobs.push(
      send(
        process.env.LEAD_NOTIFY_EMAIL,
        `Nowy lead ${lead.qualification.tier}: ${lead.studentGrade}`,
        [
          `Lead: ${lead.leadId}`,
          `Imię: ${lead.parentName}`,
          `Telefon: ${lead.phone}`,
          `E-mail: ${lead.email}`,
          `Kontakt: ${lead.contactMethod}`,
          `Klasa: ${lead.studentGrade}`,
          `Poziom: ${lead.mathLevel}`,
          `Problemy: ${lead.mainProblems.join(", ")}`,
          `Tematy: ${lead.topics.join(", ")}`,
          `Cel: ${lead.goal}`,
          `Start: ${lead.preferredStart}`,
          `Kwalifikacja: ${lead.qualification.tier} (${lead.qualification.score})`,
          `Źródło: ${lead.campaignSource}`,
          lead.message ? `Wiadomość: ${lead.message}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      ),
    );
  }
  if (process.env.SEND_CONFIRMATION_EMAIL === "true") {
    jobs.push(
      send(
        lead.email,
        `Otrzymaliśmy Twoje zgłoszenie — ${site.name}`,
        `Dzień dobry ${lead.parentName},\n\ndziękujemy za zgłoszenie. ${site.owner.firstName} skontaktuje się z Tobą, aby omówić potrzeby ucznia i dopasować odpowiednie korepetycje.\n\nJeśli wolisz porozmawiać od razu, zadzwoń: ${site.phone.display}.\n\nZespół ${site.name}`,
      ),
    );
  }
  await Promise.allSettled(jobs);
}
