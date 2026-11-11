/**
 * Google Consent Mode v2 defaults – must run BEFORE any Google tag.
 * Everything is denied until the visitor decides; a stored decision is re-applied immediately.
 */
export function ConsentDefaults() {
  const code = `
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',true);
try{var c=JSON.parse(localStorage.getItem('zm_consent_v1')||'null');if(c){var g=function(b){return b?'granted':'denied'};gtag('consent','update',{analytics_storage:g(c.analytics),ad_storage:g(c.ads),ad_user_data:g(c.ads),ad_personalization:g(c.ads)});}}catch(e){}
`.trim();
  return <script id="consent-defaults" dangerouslySetInnerHTML={{ __html: code }} />;
}
