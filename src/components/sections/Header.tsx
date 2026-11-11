"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, m, useScroll, useSpring } from "motion/react";
import { site } from "@/config/site";
import { CHAPTERS, chapterNo } from "@/config/chapters";
import { Logo } from "../ui/Logo";
import { QuizCta } from "../ui/Cta";
import { PhoneIcon } from "../ui/Icons";
import { trackCall } from "@/lib/tracking";

const NAV = CHAPTERS.filter((c) => !["dopasuj", "start"].includes(c.id));

/**
 * Mobile label: the chapter whose heading has already scrolled under the header
 * (so the label never duplicates the chapter node/H2 that is still on screen).
 */
function usePinnedChapter() {
  const [pinned, setPinned] = useState<string | null>(null);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      let found: string | null = null;
      document.querySelectorAll<HTMLElement>("[data-chapter]").forEach((sec) => {
        const h = sec.querySelector("h2");
        const r = sec.getBoundingClientRect();
        if (h && h.getBoundingClientRect().bottom < 64 && r.bottom > 120) found = sec.id;
      });
      setPinned(found);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return pinned;
}

/** Tracks which chapter is in the middle of the viewport (desktop nav highlight). */
function useActiveChapter() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter], #top"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id === "top" ? null : e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export function Header() {
  const active = useActiveChapter();
  const pinned = usePinnedChapter();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const current = CHAPTERS.find((c) => c.id === pinned);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
        scrolled ? "border-white/10 bg-base/90 backdrop-blur-xl" : "border-transparent bg-base/70 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none"
      }`}
    >
      <div className="container-x flex h-14 items-center justify-between gap-3 lg:h-[4.5rem]">
        <a href="#top" aria-label={`${site.name} — początek strony`} className="flex min-h-11 shrink-0 items-center">
          <Logo compact={!!current} />
        </a>

        {/* mobile: current chapter */}
        <div className="flex min-w-0 flex-1 justify-center lg:hidden" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {current && (
              <m.a
                key={current.id}
                href={`#${current.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="inline-flex min-h-11 items-center gap-2 truncate text-[0.9375rem] font-bold"
              >
                <span className="text-yellow-400">{chapterNo(current.id)}</span>
                <span className="truncate">{current.label}</span>
              </m.a>
            )}
          </AnimatePresence>
        </div>

        <nav aria-label="Rozdziały strony" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  aria-current={active === n.id ? "location" : undefined}
                  className={`rounded-full px-3.5 py-2 text-[0.9375rem] font-semibold transition-colors ${
                    active === n.id ? "bg-white/10 text-white" : "text-text-2 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={site.phone.href}
            onClick={() => trackCall("header")}
            className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 font-bold text-white ring-1 ring-white/20 transition-colors hover:bg-white/10 sm:px-4"
            aria-label={`Zadzwoń do Oliwii: ${site.phone.display}`}
          >
            <PhoneIcon className="text-yellow-400" />
            <span className="hidden sm:inline">{site.phone.display}</span>
          </a>
          <QuizCta location="header" className="!hidden !min-h-11 !py-2 !text-[0.9375rem] md:!inline-flex" arrow={false}>
            Dobierz korepetycje
          </QuizCta>
        </div>
      </div>
      {/* reading progress */}
      <m.div aria-hidden style={{ scaleX: progress }} className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-yellow-400" />
    </header>
  );
}
