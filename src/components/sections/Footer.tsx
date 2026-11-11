"use client";
import { site } from "@/config/site";
import { openConsentSettings } from "@/lib/consent";
import { trackCall } from "@/lib/tracking";
import { Logo } from "../ui/Logo";

export function Footer() {
  return (
    <footer data-hide-sticky className="bg-navy-950 pb-14 pt-14 text-white/70">
      <div className="container-x grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Indywidualne korepetycje online z matematyki 1:1 dla uczniów szkoły podstawowej i liceum.
          </p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-white">Kontakt</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={site.phone.href} onClick={() => trackCall("footer")} className="font-bold text-yellow-400 hover:underline">
                {site.phone.display}
              </a>
            </li>
            <li>{site.owner.name} — {site.owner.role}</li>
            {site.legal.contactEmail && (
              <li>
                <a href={`mailto:${site.legal.contactEmail}`} className="hover:text-white">{site.legal.contactEmail}</a>
              </li>
            )}
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-white">Informacje</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="/polityka-prywatnosci" className="hover:text-white">Polityka prywatności</a></li>
            <li><button type="button" onClick={openConsentSettings} className="hover:text-white">Ustawienia cookies</button></li>
            <li><a href="#faq" className="hover:text-white">FAQ</a></li>
          </ul>
        </div>
      </div>
      <div className="container-x mt-12 border-t border-white/10 pt-6 text-xs">
        © {new Date().getFullYear()} {site.name}. Wszelkie prawa zastrzeżone.
      </div>
    </footer>
  );
}
