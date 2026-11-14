import type { Metadata } from "next";
import { site } from "@/config/site";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Regulamin serwisu | ZdajMatme.com",
  description: "Zasady korzystania z serwisu ZdajMatme.com i formularza zgłoszeniowego.",
  alternates: { canonical: "/regulamin" },
};

const fill = (value: string, what: string) => value || `[UZUPEŁNIJ: ${what}]`;

/** TODO: potwierdzić — wersja robocza do weryfikacji prawnej przed uruchomieniem kampanii. */
export default function TermsPage() {
  const L = site.legal;
  return (
    <div className="min-h-screen bg-navy-950">
      <header className="border-b border-white/[0.07] py-4">
        <div className="container-x"><a href="/" aria-label="Strona główna" className="inline-flex min-h-12 items-center"><Logo /></a></div>
      </header>
      <main className="container-x max-w-3xl py-12 text-white/80 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-[720] [&_h2]:text-white [&_li]:mt-1.5 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
        <h1 className="h2 text-white">Regulamin serwisu</h1>
        <p className="text-white/55">Wersja robocza — do weryfikacji prawnej przed publikacją.</p>

        <h2>1. Usługodawca</h2>
        <p>
          Serwis {site.name} prowadzi {fill(L.controllerName, "pełna nazwa firmy")}, {fill(L.address, "adres")}, NIP {fill(L.taxId, "NIP")}.
          Kontakt: tel. {site.phone.display}, e-mail {fill(L.contactEmail, "adres e-mail")}.
        </p>

        <h2>2. Zakres serwisu</h2>
        <p>Serwis prezentuje ofertę indywidualnych korepetycji online z matematyki i umożliwia wysłanie zgłoszenia przez quiz i formularz kontaktowy.</p>

        <h2>3. Formularz zgłoszeniowy</h2>
        <ul>
          <li>Wysłanie zgłoszenia jest bezpłatne i nie oznacza zawarcia umowy o korepetycje.</li>
          <li>Odpowiedzi z quizu służą do przygotowania rozmowy i doboru korepetytora; nie stanowią diagnozy edukacyjnej.</li>
          <li>W przypadku ucznia niepełnoletniego dane kontaktowe podaje rodzic lub opiekun prawny.</li>
          <li>Cena referencyjna: {site.price.amount} zł za {site.price.minutes} minut lekcji. Szczegółowe warunki współpracy ustalane są indywidualnie. [UZUPEŁNIJ: zasady płatności, odwoływania lekcji]</li>
        </ul>

        <h2>4. Wymagania techniczne</h2>
        <p>Do korzystania z serwisu wystarczy aktualna przeglądarka internetowa. Lekcje online wymagają urządzenia z dostępem do internetu. [UZUPEŁNIJ: używana platforma do lekcji]</p>

        <h2>5. Reklamacje</h2>
        <p>Uwagi dotyczące działania serwisu można zgłaszać telefonicznie lub e-mailem. Odpowiadamy w terminie {fill("", "np. 14 dni")}.</p>

        <h2>6. Dane osobowe</h2>
        <p>Zasady przetwarzania danych opisuje <a href="/polityka-prywatnosci" className="font-semibold text-white underline">polityka prywatności</a>.</p>
      </main>
    </div>
  );
}
