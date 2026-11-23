/** ZdajMatme.com wordmark – same as zdajmatme.com: "Zdaj" white, "Matme.com" orange, Poppins 700. */
export function Logo({ variant = "wordmark", className = "" }: { variant?: "wordmark" | "full"; className?: string }) {
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className={`font-bold tracking-[-0.02em] text-white ${variant === "full" ? "text-[1.9rem]" : "text-[1.3rem] sm:text-[1.45rem]"}`}>
        Zdaj<span className="text-accent">Matme.com</span>
      </span>
      {variant === "full" && <span className="mt-2 text-[0.8rem] font-medium tracking-[0.02em] text-white/60">Matematyka, która buduje pewność siebie</span>}
    </span>
  );
}
