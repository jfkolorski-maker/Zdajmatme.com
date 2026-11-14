"use client";
import { site } from "@/config/site";
import { CHAPTERS } from "@/config/chapters";
import { openConsentSettings } from "@/lib/consent";
import { trackCall } from "@/lib/tracking";
import { Logo } from "../ui/Logo";

const link = "inline-flex min-h-12 items-center text-white/65 hover:text-white";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-navy-950 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-10 lg:pb-12 lg:pt-14">
      <div className="container-x grid gap-8 text-center sm:grid-cols-3 sm:text-left">
        <div>
          <Logo />
          <p className="mt-3 text-white/60">Korepetycje z matematyki online 1:1. Lekcje prowadzimy zdalnie.</p>
        </div>
        <nav aria-label="Rozdziały">
          <p className="kicker kicker-plain text-white">Strona</p>
          <ul className="mt-2">
            {CHAPTERS.map((c) => (
              <li key={c.id}><a href={`#${c.id}`} className={link}>{c.label}</a></li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="kicker kicker-plain text-white">Kontakt</p>
          <ul className="mt-2">
            <li><a href={site.phone.href} onClick={() => trackCall("footer")} className={`${link} font-bold !text-yellow-400`}>{site.phone.display}</a></li>
            {site.legal.contactEmail && <li><a href={`mailto:${site.legal.contactEmail}`} className={link}>{site.legal.contactEmail}</a></li>}
            <li><a href="/polityka-prywatnosci" className={link}>Polityka prywatności</a></li>
            <li><a href="/regulamin" className={link}>Regulamin</a></li>
            <li><button type="button" onClick={openConsentSettings} className={link}>Ustawienia cookies</button></li>
          </ul>
        </div>
      </div>
      <p className="container-x mt-8 border-t border-white/[0.07] pt-5 text-center text-[0.85rem] text-white/60 sm:text-left">
        © {new Date().getFullYear()} {site.name}
      </p>
    </footer>
  );
}
