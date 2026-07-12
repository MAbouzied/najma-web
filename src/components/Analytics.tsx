import { ANALYTICS } from "@/content/analytics";

type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function AnalyticsScripts() {
  if (!ANALYTICS.enabled) return null;

  const { gtm, ga4, snapchat } = ANALYTICS;

  return (
    <>
      {/* Google Tag Manager */}
      {gtm.primaryId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtm.primaryId}');`,
          }}
        />
      )}
      {/* GA4 via gtag when measurement ID is set */}
      {ga4.measurementId && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4.measurementId}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4.measurementId}');`,
            }}
          />
        </>
      )}
      {/* Snapchat Pixel */}
      {snapchat.pixelId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script';r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})(window,document,'https://sc-static.net/scevent.min.js');snaptr('init','${snapchat.pixelId}');snaptr('track','PAGE_VIEW');`,
          }}
        />
      )}
    </>
  );
}

export function AnalyticsNoScript() {
  if (!ANALYTICS.enabled || !ANALYTICS.gtm.primaryId) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${ANALYTICS.gtm.primaryId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
