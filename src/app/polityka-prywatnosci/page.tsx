import type { Metadata } from "next";
import { CompanyCard, H, LegalShell, SITE_HOST } from "@/components/legal/LegalShell";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = {
  title: "Polityka prywatności | ZdajMatme.com",
  description: "Zasady przetwarzania danych osobowych i plików cookies w serwisie ZdajMatme.com.",
  alternates: { canonical: `${BRAND.url}/polityka-prywatnosci` },
};

/** TODO: potwierdzić – wersja robocza do weryfikacji prawnej przed uruchomieniem kampanii. */
export default function PrivacyPage() {
  return (
    <LegalShell title="Polityka prywatności" updated="[UZUPEŁNIJ: data]">
      <H n={1}>Administrator danych</H>
      <p>Administratorem danych osobowych zbieranych w serwisie {SITE_HOST} jest:</p>
      <CompanyCard />

      <H n={2}>Jakie dane i w jakim celu</H>
      <ul>
        <li>
          <strong>Obsługa zgłoszenia (lekcja próbna, kontakt)</strong> – imię, numer telefonu, opcjonalnie e-mail, preferowane godziny, treść wiadomości
          oraz odpowiedzi z quizu (oferta, etap i poziom nauki, cel, termin startu). Podstawa: podjęcie działań na żądanie osoby, której dane dotyczą
          (art. 6 ust. 1 lit. b RODO) oraz zgoda wyrażona w formularzu (art. 6 ust. 1 lit. a RODO).
        </li>
        <li>
          <strong>Informacje o ofercie</strong> – tylko po zaznaczeniu dobrowolnej zgody marketingowej (art. 6 ust. 1 lit. a RODO). Zgodę można wycofać w każdej chwili.
        </li>
        <li>
          <strong>Źródło zgłoszenia</strong> – parametry UTM i identyfikatory kliknięć reklam (np. GCLID), aby wiedzieć, z której kampanii przyszło zgłoszenie
          (prawnie uzasadniony interes, art. 6 ust. 1 lit. f RODO).
        </li>
      </ul>

      <H n={3}>Dane uczniów niepełnoletnich</H>
      <p>
        Jeżeli uczeń jest niepełnoletni, dane kontaktowe podaje rodzic lub opiekun prawny. Odpowiedzi z quizu nie są przekazywane do narzędzi analitycznych
        ani reklamowych.
      </p>

      <H n={4}>Odbiorcy danych</H>
      <p>
        Dane mogą być powierzane podmiotom, które świadczą dla nas usługi: hosting strony (Vercel), system obsługi zgłoszeń / CRM ([UZUPEŁNIJ: dostawca]), poczta
        e-mail, a po wyrażeniu zgody na cookies – Google (Google Ads, Google Analytics) i Meta (Facebook, Instagram). Film „Przykładowa lekcja” ładuje się z
        YouTube (youtube-nocookie.com) dopiero po kliknięciu przycisku odtwarzania.
      </p>

      <H n={5}>Okres przechowywania</H>
      <p>Dane ze zgłoszenia przechowujemy przez czas potrzebny do jego obsługi, a jeśli nie dojdzie do współpracy – nie dłużej niż [UZUPEŁNIJ: np. 12 miesięcy]. Dane przetwarzane na podstawie zgody – do jej wycofania.</p>

      <H n={6}>Twoje prawa</H>
      <p>
        Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia, wniesienia sprzeciwu oraz cofnięcia zgody (bez
        wpływu na zgodność z prawem przetwarzania przed jej cofnięciem), a także prawo skargi do Prezesa UODO. Kontakt w sprawie danych:{" "}
        <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>.
      </p>

      <H n={7}>Pliki cookies</H>
      <p>
        Serwis używa niezbędnego przechowywania danych w przeglądarce (postęp quizu w bieżącej sesji, Twój wybór dotyczący cookies). Pliki cookies Google i Meta
        do mierzenia skuteczności reklam są używane wyłącznie po kliknięciu „Akceptuję” w banerze. Ustawienia cookies możesz też zmienić w swojej przeglądarce.
      </p>
    </LegalShell>
  );
}
