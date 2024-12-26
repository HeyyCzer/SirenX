"use client";

import * as gtag from "@/gtag";
import Script from "next/script";

const GoogleAnalytics = () => {
	if (!gtag.GA_TRACKING_ID) return null;

	return (
		<>
			<Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`} />
			<Script
				id="gtag-init"
				strategy="afterInteractive"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{
					__html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${gtag.GA_TRACKING_ID}', {
                      page_path: window.location.pathname,
                      });
                    `,
				}}
			/>
		</>
	);
};

export default GoogleAnalytics;