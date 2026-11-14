"use client";
import Script from "next/script";
import { useConsent } from "@/lib/consent";
import { trackingConfig as cfg } from "@/lib/tracking";

/**
 * Loads EITHER Google Tag Manager OR gtag.js (GA4 + Google Ads) – never both.
 * consentMode=basic (default): tags load only after the visitor granted analytics or ads consent.
 * consentMode=advanced: tags load immediately and respect Consent Mode signals (cookieless pings).
 */
export function TrackingScripts() {
  const consent = useConsent();
  if (cfg.mode === "off") return null;
  const allowed = cfg.consentMode === "advanced" || !!(consent && (consent.analytics || consent.ads));
  if (!allowed) return null;

  if (cfg.mode === "gtm" && cfg.gtmId) {
    return (
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${cfg.gtmId}');`}
      </Script>
    );
  }

  if (cfg.mode === "gtag" && (cfg.ga4Id || cfg.adsId)) {
    const first = cfg.ga4Id || cfg.adsId;
    return (
      <>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${first}`} strategy="afterInteractive" />
        {cfg.metaPixelId && consent?.ads && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${cfg.metaPixelId}');fbq('track','PageView');`}
          </Script>
        )}
        <Script id="gtag-init" strategy="afterInteractive">
          {`gtag('js', new Date());
${cfg.ga4Id ? `gtag('config','${cfg.ga4Id}');` : ""}
${cfg.adsId ? `gtag('config','${cfg.adsId}'${cfg.enhancedConversions ? ",{allow_enhanced_conversions:true}" : ""});` : ""}`}
        </Script>
      </>
    );
  }
  return null;
}
