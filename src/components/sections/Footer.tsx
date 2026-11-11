"use client";
import { site } from "@/config/site";
import { openConsentSettings } from "@/lib/consent";
import { trackCall } from "@/lib/tracking";
import { Logo } from "../ui/Logo";

export function Footer() {
  return (
    <footer className="bg-navy-950 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-14 text-white/70 md:pb-14">
      <div className="container-x grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Indywidualne korepetycje online z matematyki 1:1 dla uczniów szkoły podstawowej i liceum.
          </p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-white">Kontakt</p>
          <ul className="mt-3 text-[0.9375rem]">
            <li>
              <a href={site.phone.href} onClick={() => trackCall("footer")} className="inline-flex min-h-11 items-center font-bold text-yellow-400 hover:underline">
                {site.phone.display}
              </a>
            </li>
            <li>{site.owner.name} — {site.owner.role}</li>
            {site.legal.contactEmail && (
              <li>
                <a href={`mailto:${site.legal.contactEmail}`} className="inline-flex min-h-11 items-center hover:text-white">{site.legal.contactEmail}</a>
              </li>
            )}
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-white">Informacje</p>
          <ul className="mt-3 text-[0.9375rem]">
            <li><a href="/polityka-prywatnosci" className="inline-flex min-h-11 items-center hover:text-white">Polityka prywatności</a></li>
            <li><button type="button" onClick={openConsentSettings} className="inline-flex min-h-11 items-center hover:text-white">Ustawienia cookies</button></li>
            <li><a href="#faq" className="inline-flex min-h-11 items-center hover:text-white">FAQ</a></li>
          </ul>
        </div>
      </div>
      <div className="container-x mt-12 border-t border-white/10 pt-6 text-[0.8125rem]">
        © {new Date().getFullYear()} {site.name}. Wszelkie prawa zastrzeżone.
      </div>
    </footer>
  );
}
