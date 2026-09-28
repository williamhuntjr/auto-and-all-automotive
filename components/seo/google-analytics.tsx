import Script from "next/script";
import { SITE } from "@/common/lib/seo";

/**
 * Google Analytics 4. Checks the hostname in the browser and only loads on the
 * live domain, so localhost, Vercel previews and *.vercel.app URLs never show
 * up in the reports. Page views on client-side navigation are picked up by
 * GA's enhanced measurement (browser history changes).
 */
export function GoogleAnalytics() {
  const id = SITE.gaMeasurementId;
  return (
    <Script id="google-analytics" strategy="afterInteractive">
      {`if (location.hostname === ${JSON.stringify(SITE.gaHostname)}) {
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=${id}';
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){dataLayer.push(arguments);};
  gtag('js', new Date());
  gtag('config', '${id}');
}`}
    </Script>
  );
}
