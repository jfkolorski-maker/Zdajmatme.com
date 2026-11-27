import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { BRAND } from "@/config/brand";
import { OFFER } from "@/data/content";
import { Logo } from "./Logo";

const link = "inline-flex min-h-11 items-center text-white/70 transition-colors hover:text-white";

/** Four columns as on zdajmatme.com (brand · Nasza oferta · Na skróty · Kontakt); centred stack on phones. */
export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-night pb-24 text-white md:pb-0">
      <div className="shell grid gap-9 py-14 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-4">
        <div className="flex flex-col items-center sm:items-start">
          <Logo />
          <p className="mt-3 max-w-[18rem] text-[0.95rem] leading-relaxed text-white/60">Matematyka, która buduje pewność siebie. Pomagamy na każdym etapie edukacji.</p>
        </div>
        <nav aria-label="Nasza oferta">
          <h2 className="text-[1rem] font-semibold text-accent">Nasza oferta</h2>
          <ul className="mt-2">
            {OFFER.items.map((o) => (
              <li key={o.id}>
                <Link href={o.href} className={link}>
                  {o.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Na skróty">
          <h2 className="text-[1rem] font-semibold text-accent">Na skróty</h2>
          <ul className="mt-2">
            <li><Link href="/#o-nas" className={link}>O nas</Link></li>
            <li><a href="#zapisy" className={link}>Pierwsza lekcja</a></li>
            <li><Link href="/#faq" className={link}>FAQ</Link></li>
          </ul>
        </nav>
        <address className="not-italic">
          <h2 className="text-[1rem] font-semibold text-accent">Kontakt</h2>
          <ul className="mt-2">
            <li className="my-2"><PhoneLink placement="footer" className="group inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-accent px-5 font-semibold tabular-nums text-white transition-colors hover:bg-accent hover:text-night"><Icon name="phone" size={17} className="text-accent group-hover:text-night" />{BRAND.phone}</PhoneLink></li>
            <li><a href={`mailto:${BRAND.email}`} className={`${link} break-all`}>{BRAND.email}</a></li>
            <li className="text-sm text-white/50">Zajęcia online na Microsoft Teams</li>
          </ul>
        </address>
      </div>
      <div className="border-t border-white/10">
        <div className="shell flex flex-col items-center justify-between gap-2 py-5 text-sm text-white/55 sm:flex-row">
          <span>© {new Date().getFullYear()} {BRAND.name}. Wszelkie prawa zastrzeżone.</span>
          <span className="flex gap-5">
            <a href={BRAND.privacyUrl} className="inline-flex min-h-11 items-center hover:text-white">Polityka prywatności</a>
            <a href="/regulamin" className="inline-flex min-h-11 items-center hover:text-white">Regulamin</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
