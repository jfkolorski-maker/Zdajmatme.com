"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, m, useScroll, useSpring } from "motion/react";
import { site } from "@/config/site";
import { CHAPTERS, chapterNo } from "@/config/chapters";
import { trackCall } from "@/lib/tracking";
import { Logo } from "../ui/Logo";
import { PhoneIcon } from "../ui/Icons";

/** Chapter in the middle of the viewport (desktop menu dot + mobile label). */
function useActiveChapter() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter], #top"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id === "top" ? null : e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export function Header() {
  const active = useActiveChapter();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 420, damping: 34 });
  const current = CHAPTERS.find((c) => c.id === active);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[68px] border-b border-white/[0.07] bg-navy-950/85 backdrop-blur-xl">
      <div className="container-x flex h-full items-center justify-between gap-3">
        <a href="#top" aria-label={`${site.name} — początek strony`} className="flex min-h-12 shrink-0 items-center">
          <Logo compact={!!current} />
        </a>

        {/* mobile: current chapter instead of a menu */}
        <div className="flex min-w-0 flex-1 justify-center lg:hidden" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {current && (
              <m.a
                key={current.id}
                href={`#${current.id}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="kicker kicker-plain min-h-12 truncate !gap-1.5 text-white"
              >
                <span className="text-yellow-400">{chapterNo(current.id)}</span>· {current.label}
              </m.a>
            )}
          </AnimatePresence>
        </div>

        <nav aria-label="Rozdziały strony" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {CHAPTERS.filter((c) => c.id !== "kontakt").map((n) => {
              const on = active === n.id;
              return (
                <li key={n.id}>
                  <a href={`#${n.id}`} aria-current={on ? "location" : undefined} className={`relative block px-3 py-3 text-[0.95rem] font-semibold transition-colors ${on ? "text-white" : "text-white/65 hover:text-white"}`}>
                    {n.label}
                    {on && <m.span layoutId="nav-dot" className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-yellow-400" />}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <a
          href={site.phone.href}
          onClick={() => trackCall("header")}
          aria-label={`Zadzwoń do ${site.owner.firstNameGenitive}: ${site.phone.display}`}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-yellow-400 text-navy-950 transition-colors hover:bg-yellow-300 lg:flex lg:w-auto lg:gap-2 lg:px-5 lg:font-bold"
        >
          <PhoneIcon />
          <span className="hidden lg:inline">{site.phone.display}</span>
        </a>
      </div>
      <m.div aria-hidden style={{ scaleX: progress }} className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-yellow-400" />
    </header>
  );
}
