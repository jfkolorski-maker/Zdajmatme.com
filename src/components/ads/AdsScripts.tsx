import Script from "next/script";

const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID || "";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

/**
 * Loads gtag.js / Meta Pixel only when their IDs are configured.
 * Consent is denied by default until the visitor accepts in the banner.
 */
export function AdsScripts() {
  return (
    <>
      {GADS_ID && (
        <>
          {/* Consent defaults must run before gtag.js loads – plain inline script. */}
          <script
            id="gtag-consent"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
try{if(localStorage.getItem('zdajmatme.consent')==='granted'){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});}}catch(e){}
gtag('js',new Date());gtag('config','${GADS_ID}');`,
            }}
          />
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`} strategy="afterInteractive" />
        </>
      )}
      {META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
var granted=false;try{granted=localStorage.getItem('zdajmatme.consent')==='granted'}catch(e){}
fbq('consent',granted?'grant':'revoke');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
