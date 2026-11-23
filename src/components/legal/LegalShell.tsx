import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/layout/Logo";
import { BRAND } from "@/config/brand";

/**
 * Operator data shared by the privacy policy and the terms.
 * TODO: potwierdzić – set NEXT_PUBLIC_LEGAL_NAME / _ADDRESS / _IDS before launch (placeholders are visible on purpose).
 */
export const COMPANY = {
  name: process.env.NEXT_PUBLIC_LEGAL_NAME || "[UZUPEŁNIJ: nazwa firmy / imię i nazwisko przedsiębiorcy]",
  address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS || "[UZUPEŁNIJ: adres]",
  ids: process.env.NEXT_PUBLIC_LEGAL_IDS || "[UZUPEŁNIJ: NIP / REGON]",
};

export const SITE_HOST = BRAND.url.replace(/^https?:\/\//, "");

export function H({ n, children }: { n: number; children: ReactNode }) {
  return (
    <h2 className="mt-12 mb-4 text-[1.35rem] font-bold tracking-[-0.02em] text-surface">
      <span className="mr-2 text-accent">{n}.</span>
      {children}
    </h2>
  );
}

export function CompanyCard() {
  return (
    <p className="mt-2 rounded-xl bg-surface/[0.04] p-4 font-medium text-ink">
      {COMPANY.name}
      <br />
      {COMPANY.address}
      <br />
      {COMPANY.ids}
      <br />
      E-mail: <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a> · tel. <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`}>{BRAND.phone}</a>
    </p>
  );
}

/** Plain document page: header with the logo, readable column, link back. */
export function LegalShell({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-white">
      <header className="bg-night text-white">
        <div className="shell flex h-[68px] items-center justify-between">
          <Link href="/" aria-label="Strona główna">
            <Logo />
          </Link>
          <Link href="/" className="text-sm font-semibold text-white/75 hover:text-white">
            ← Wróć na stronę
          </Link>
        </div>
      </header>
      <main className="shell max-w-[46rem] py-12 text-[1rem] leading-[1.7] text-ink/85 md:py-16 [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_a]:decoration-accent [&_a]:decoration-2 [&_a]:underline-offset-2 [&_li]:mt-1.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6">
        <h1 className="text-[clamp(1.9rem,6vw,2.8rem)] font-bold tracking-[-0.03em] text-surface">{title}</h1>
        <p className="mt-3 text-sm text-ink/55">Obowiązuje od {updated}</p>
        {children}
        <nav className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-surface/10 pt-8 text-sm">
          <Link href="/" className="btn btn-primary !text-night !no-underline">
            Wróć na stronę główną
          </Link>
          <Link href="/polityka-prywatnosci">Polityka prywatności</Link>
          <Link href="/regulamin">Regulamin</Link>
        </nav>
      </main>
    </div>
  );
}
