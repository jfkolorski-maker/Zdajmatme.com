import type { Metadata } from "next";
import { site } from "@/config/site";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Polityka prywatności | ZdajMatme.com",
  description: "Informacje o przetwarzaniu danych osobowych i plikach cookies w serwisie ZdajMatme.com.",
  alternates: { canonical: "/polityka-prywatnosci" },
};

/** Placeholder shown where legal data still has to be provided (see DEPLOYMENT.md). */
const fill = (value: string, what: string) => value || `[UZUPEŁNIJ: ${what}]`;

export default function PrivacyPage() {
  const L = site.legal;
  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-navy-950 py-5">
        <div className="container-x">
          <a href="/" aria-label="Strona główna">
            <Logo />
          </a>
        </div>
      </header>
      <main className="container-x max-w-3xl py-14 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-extrabold [&_li]:mt-1.5 [&_p]:mt-3 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
        <h1 className="text-4xl font-extrabold">Polityka prywatności</h1>
        <p className="text-ink-muted">Wersja robocza do weryfikacji prawnej przed uruchomieniem kampanii.</p>

        <h2>1. Administrator danych</h2>
        <p>
          Administratorem danych osobowych jest {fill(L.controllerName, "pełna nazwa firmy / imię i nazwisko przedsiębiorcy")},{" "}
          {fill(L.address, "adres siedziby")}, NIP: {fill(L.taxId, "NIP")}, prowadzący serwis {site.name}. Kontakt: tel. {site.phone.display},
          e-mail: {fill(L.contactEmail, "adres e-mail do spraw danych osobowych")}.
        </p>

        <h2>2. Jakie dane i w jakim celu przetwarzamy</h2>
        <ul>
          <li>
            <b>Obsługa zgłoszenia</b> — imię, numer telefonu, adres e-mail, preferowana forma kontaktu, treść wiadomości oraz odpowiedzi z quizu
            (etap i poziom nauki, trudności, cel, termin rozpoczęcia). Cel: kontakt w sprawie korepetycji i przygotowanie oferty na żądanie osoby
            zgłaszającej (art. 6 ust. 1 lit. b RODO).
          </li>
          <li>
            <b>Marketing</b> — wyłącznie po wyrażeniu dobrowolnej zgody w formularzu (art. 6 ust. 1 lit. a RODO). Zgodę można wycofać w każdej chwili.
          </li>
          <li>
            <b>Źródło kampanii</b> — parametry UTM i identyfikatory kliknięć reklam (np. GCLID), aby wiedzieć, z jakiej kampanii pochodzi zgłoszenie
            (prawnie uzasadniony interes, art. 6 ust. 1 lit. f RODO).
          </li>
          <li>
            <b>Ustalenie lub dochodzenie roszczeń</b> (art. 6 ust. 1 lit. f RODO).
          </li>
        </ul>

        <h2>3. Dane uczniów niepełnoletnich</h2>
        <p>
          Jeżeli uczeń jest niepełnoletni, dane kontaktowe podaje rodzic lub opiekun prawny. Nie zbieramy imienia, nazwiska ani danych kontaktowych
          ucznia niepełnoletniego. Odpowiedzi z quizu nie są przekazywane do narzędzi analitycznych.
        </p>

        <h2>4. Odbiorcy danych</h2>
        <p>
          Dane mogą być powierzane podmiotom świadczącym usługi na rzecz administratora: dostawcy hostingu, systemu CRM ({fill("", "nazwa dostawcy CRM, np. Base44")}),
          poczty e-mail oraz — po wyrażeniu zgody — Google Ireland Ltd. (Google Analytics, Google Ads). Dane osobowe z formularza nie są przekazywane do
          Google Analytics.
        </p>

        <h2>5. Okres przechowywania</h2>
        <p>
          Dane ze zgłoszenia przechowujemy przez okres niezbędny do jego obsługi, a jeśli nie dojdzie do współpracy — nie dłużej niż{" "}
          {fill("", "okres, np. 12 miesięcy")}. Dane przetwarzane na podstawie zgody — do jej wycofania.
        </p>

        <h2>6. Twoje prawa</h2>
        <p>
          Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia, wniesienia sprzeciwu oraz cofnięcia zgody
          (bez wpływu na zgodność z prawem przetwarzania przed jej cofnięciem). Przysługuje Ci skarga do Prezesa Urzędu Ochrony Danych Osobowych.
          Podanie danych jest dobrowolne, ale niezbędne do obsługi zgłoszenia.
        </p>

        <h2>7. Pliki cookies</h2>
        <p>
          Serwis używa niezbędnych mechanizmów przechowywania danych w przeglądarce (np. zapamiętanie postępu quizu w bieżącej sesji i wyboru dotyczącego
          cookies). Cookies analityczne (Google Analytics) i reklamowe (Google Ads) są używane wyłącznie po wyrażeniu zgody w banerze. Wybór możesz
          zmienić w dowolnym momencie przez link „Ustawienia cookies” w stopce.
        </p>
      </main>
    </div>
  );
}
