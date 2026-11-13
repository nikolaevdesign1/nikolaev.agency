"use client";

import { useEffect } from "react";
import Script from "next/script";
import { CONSENT_KEY, track } from "@/lib/analytics";

/**
 * Google Analytics 4 with consent mode: until the visitor accepts the cookie notice the tag
 * sends cookieless pings only; advertising storage is never enabled.
 */
export function Analytics({ id }: { id: string }) {
  useEffect(() => {
    // One listener covers every project link on the site.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="/projects/"]');
      const slug = link?.getAttribute("href")?.split("/")[2];
      if (slug) track("select_content", { content_type: "project", content_id: slug });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <Script id="ga-setup" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
var c=null;try{c=localStorage.getItem(${JSON.stringify(CONSENT_KEY)})}catch(e){}
gtag('consent','default',{analytics_storage:c==='accepted'?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
gtag('js',new Date());gtag('config',${JSON.stringify(id)});`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
    </>
  );
}
