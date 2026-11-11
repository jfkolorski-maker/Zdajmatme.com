export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const text = tone === "dark" ? "text-white" : "text-navy-950";
  return (
    <span className={`inline-flex items-center gap-2.5 font-extrabold tracking-tight ${text}`}>
      <span aria-hidden className="grid h-9 w-9 place-items-center rounded-xl bg-yellow-400 text-navy-950 shadow-[0_6px_16px_-6px_rgb(255_201_40/0.8)]">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 13l3.2 6L11 4h10" />
          <path d="M12.5 10.5l5 6M17.5 10.5l-5 6" strokeWidth="2.2" />
        </svg>
      </span>
      <span className="text-[1.15rem] leading-none">
        Zdaj<span className={tone === "dark" ? "text-yellow-400" : "text-navy-700 underline decoration-yellow-400 decoration-[3px] underline-offset-4"}>Matme</span>
        <span className={tone === "dark" ? "text-navy-300" : "text-ink-muted"}>.com</span>
      </span>
    </span>
  );
}
