/** Brand mark + wordmark. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 font-[760] tracking-[-0.02em] text-white">
      <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-yellow-400 text-navy-950">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 13l3.2 6L11 4h10" />
          <path d="M12.5 10.5l5 6M17.5 10.5l-5 6" strokeWidth="2.2" />
        </svg>
      </span>
      <span className={`text-[1.12rem] leading-none ${compact ? "max-lg:sr-only" : ""}`}>
        Zdaj<span className="text-yellow-400">Matme</span>
        <span className="text-white/55">.com</span>
      </span>
    </span>
  );
}
