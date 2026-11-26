"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icons";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { BRAND } from "@/config/brand";
import { CHAPTERS, NAV, chapterOf, type ChapterId } from "@/data/content";
import { DUR, EASE_OUT } from "@/lib/motion";
import { Logo } from "./Logo";

/**
 * Frosted bar with a "where am I" guide: on phones the current chapter
 * ("04 · Pierwsza lekcja") sits between logo and phone; on desktop the
 * matching link is highlighted. A hairline progress bar runs along the bottom.
 */
export function Header() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const [current, setCurrent] = useState<ChapterId | null>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 40, mass: 0.4 });

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // the chapter crossing the middle of the screen is "here"
  useEffect(() => {
    const els = CHAPTERS.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const hero = document.getElementById("start");
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          setCurrent(e.target.id === "start" ? null : (e.target.id as ChapterId));
        }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    if (hero) io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!menu) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [menu]);

  const c = current ? chapterOf(current) : null;

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DUR.section, ease: EASE_OUT }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${solid ? "border-b border-white/10 bg-header/95 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.7)] backdrop-blur-xl" : "border-b border-white/5 bg-header/85 backdrop-blur-md"}`}
    >
      <div className="shell flex h-[68px] items-center justify-between gap-2 sm:gap-4">
        <a href={pathname === "/" ? "#start" : "/"} aria-label="ZdajMatme.com – strona główna" className="flex min-h-12 items-center">
          <Logo />
        </a>
        {/* phones: where am I */}
        <div className="relative h-5 min-w-0 flex-1 overflow-hidden text-center lg:hidden" aria-live="polite">
          <AnimatePresence initial={false}>
            {c && (
              <motion.p
                key={c.n}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: DUR.ui, ease: EASE_OUT }}
                className="absolute inset-0 truncate text-[0.72rem] font-bold uppercase leading-5 tracking-[0.06em] text-white/85"
              >
                <span className="text-accent-bright">{c.short}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <nav aria-label="Główna nawigacja" className="hidden items-center gap-5 whitespace-nowrap lg:flex xl:gap-8">
          {NAV.map((n) => {
            // a sub-page link is "on" on its page; a home-section link while that section is on screen
            const on = n.href.includes("#") ? pathname === "/" && current === n.href.split("#")[1] : pathname === n.href;
            return (
              <Link key={n.href} href={n.href} aria-current={on ? (n.href.includes("#") ? "location" : "page") : undefined} className={`relative text-[0.95rem] font-semibold transition-colors ${on ? "text-white" : "text-white/65 hover:text-white"}`}>
                {n.label}
                {on && <motion.span layoutId="nav-dot" className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent-bright" />}
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => setMenu((m) => !m)}
          aria-expanded={menu}
          aria-controls="mobile-menu"
          aria-label={menu ? "Zamknij menu" : "Otwórz menu"}
          className="grid h-12 w-12 place-items-center rounded-full text-white ring-1 ring-white/20 transition-colors hover:bg-white/10 lg:hidden"
        >
          <Icon name={menu ? "close" : "menu"} size={22} />
        </button>
        <PhoneLink
          placement="header"
          className={`inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-full px-3.5 text-[0.95rem] font-bold transition-colors sm:px-5 bg-accent text-night shadow-[0_10px_24px_-10px_rgba(255,165,80,0.8)] hover:bg-accent-bright`}
        >
          <Icon name="phone" size={18} />
          <span className="hidden sm:inline lg:hidden xl:inline">{BRAND.phone}</span>
          <span className="sr-only sm:hidden lg:inline xl:hidden">Zadzwoń do Oliwii</span>
        </PhoneLink>
        </div>
      </div>
      <AnimatePresence>
        {menu && (
          <motion.nav
            id="mobile-menu"
            aria-label="Menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: DUR.ui, ease: EASE_OUT }}
            className="border-t border-white/10 bg-header lg:hidden"
          >
            <ul className="shell py-3">
              {NAV.map((n) => {
                const on = !n.href.includes("#") && pathname === n.href;
                return (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      onClick={() => setMenu(false)}
                      aria-current={on ? "page" : undefined}
                      className={`flex min-h-12 items-center justify-between border-b border-white/[0.07] text-[1.05rem] font-semibold ${on ? "text-accent-bright" : "text-white"}`}
                    >
                      {n.label}
                      <Icon name="arrow" size={18} className="text-accent" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
      <motion.div aria-hidden="true" className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-accent-bright" style={{ scaleX: progress }} />
    </motion.header>
  );
}
