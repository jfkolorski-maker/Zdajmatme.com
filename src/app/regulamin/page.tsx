import type { Metadata } from "next";
import { CompanyCard, H, LegalShell, SITE_HOST } from "@/components/legal/LegalShell";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = {
  title: "Regulamin serwisu | ZdajMatme.com",
  description: "Zasady korzystania z serwisu ZdajMatme.com i formularza zgłoszeniowego.",
  alternates: { canonical: `${BRAND.url}/regulamin` },
};

/** TODO: potwierdzić – wersja robocza do weryfikacji prawnej przed uruchomieniem kampanii. */
export default function TermsPage() {
  return (
    <LegalShell title="Regulamin serwisu" updated="[UZUPEŁNIJ: data]">
      <H n={1}>Usługodawca</H>
      <p>Serwis {SITE_HOST} prowadzi:</p>
      <CompanyCard />

      <H n={2}>Zakres serwisu</H>
      <p>
        Serwis prezentuje ofertę ZdajMatme.com: korepetycje indywidualne z matematyki online, kurs do egzaminu ósmoklasisty i kurs maturalny, oraz umożliwia
        wysłanie zgłoszenia na lekcję próbną przez quiz i formularz.
      </p>

      <H n={3}>Zgłoszenie</H>
      <ul>
        <li>Wysłanie zgłoszenia jest bezpłatne i nie oznacza zawarcia umowy o zajęcia.</li>
        <li>Odpowiedzi z quizu służą do przygotowania rozmowy i doboru zajęć; nie są diagnozą edukacyjną.</li>
        <li>W przypadku ucznia niepełnoletniego dane kontaktowe podaje rodzic lub opiekun prawny.</li>
        <li>
          Cena referencyjna lekcji indywidualnej online: {BRAND.price.label}. Lekcje indywidualne rozliczane są po każdym miesiącu nauki, kursy grupowe – jednorazowo
          lub w ratach. Szczegóły ustalane są indywidualnie.
        </li>
        <li>Odwołanie lekcji indywidualnej najpóźniej 24 godziny przed terminem pozwala bezpłatnie przełożyć zajęcia.</li>
      </ul>

      <H n={4}>Wymagania techniczne</H>
      <p>Do korzystania z serwisu wystarczy aktualna przeglądarka. Zajęcia odbywają się na platformie ZOOM i wymagają urządzenia z dostępem do internetu.</p>

      <H n={5}>Reklamacje</H>
      <p>
        Uwagi dotyczące serwisu można zgłaszać na adres <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a> lub telefonicznie. Odpowiadamy w terminie [UZUPEŁNIJ: np. 14
        dni].
      </p>

      <H n={6}>Dane osobowe</H>
      <p>
        Zasady przetwarzania danych opisuje <a href="/polityka-prywatnosci">polityka prywatności</a>.
      </p>
    </LegalShell>
  );
}
