"use client";
import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { Logo } from "../ui/Logo";
import { QuizCta } from "../ui/Cta";
import { PhoneIcon } from "../ui/Icons";
import { trackCall } from "@/lib/tracking";

const NAV = [
  { href: "#sciezki", label: "Dla kogo" },
  { href: "#wspolpraca", label: "Jak działamy" },
  { href: "#lekcja", label: "Lekcja online" },
  { href: "#zespol", label: "Zespół" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled ? "bg-navy-950/85 shadow-[0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <a href="#top" aria-label={`${site.name} — strona główna`} className="shrink-0">
          <Logo />
        </a>
        <nav aria-label="Główna nawigacja" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="rounded-full px-3.5 py-2 text-[0.9375rem] font-semibold text-white/75 transition-colors hover:bg-white/8 hover:text-white">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={site.phone.href}
            onClick={() => trackCall("header")}
            className="inline-flex h-11 items-center gap-2 rounded-full px-3 font-bold text-white ring-1 ring-white/20 transition-colors hover:bg-white/10 sm:px-4"
            aria-label={`Zadzwoń: ${site.phone.display}`}
          >
            <PhoneIcon className="text-yellow-400" />
            <span className="hidden sm:inline">{site.phone.display}</span>
          </a>
          <QuizCta location="header" className="!hidden !min-h-11 !py-2 !text-[0.9375rem] md:!inline-flex" arrow={false}>
            Dopasuj korepetycje
          </QuizCta>
        </div>
      </div>
    </header>
  );
}
