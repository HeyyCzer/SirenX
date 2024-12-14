import Image from "next/image";
import Link from "next/link";
import "./fonts.css";
import "./globals.css";
import "./modals.css";

import GoogleAnalytics from "@/components/GoogleAnalytics";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import dynamic from "next/dynamic";
import Script from "next/script";
config.autoAddCss = false;

export const metadata = {
	metadataBase: new URL("https://sirenx.heyyczer.com"),
	title: "SirenX - Make GTA V sirens easily",
	description:
		"SirenX is a web-based application that allows you to create and edit your GTA V carcols.meta sirens with ease. What about save your time using a simple and intuitive interface?",

	openGraph: {
		url: "https://sirenx.heyyczer.com",
		locale: "pt_BR",
		images: {
			url: "/images/logo.png",
			width: 256,
			height: 256,
		},
	},
	twitter: {
		cardType: "summary",
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="dark bg-slate-950">
				<GoogleAnalytics />

				<Script
					async
					src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
					strategy="lazyOnload"
					crossOrigin="anonymous"
				/>

				{children}

				<footer className="py-4 bg-slate-900 flex flex-col justify-center items-center gap-4">
					<p className="text-center text-gray-300/60 text-sm">
						Made with{" "}
						<span className="bg-clip-text bg-emerald-400 text-transparent animate-ping">
							💚
						</span>{" "}
						by{" "}
						<Link
							href="https://bio.site/HeyyCzer"
							className="text-white font-bold underline underline-offset-2 hover:text-emerald-400 transition-all"
						>
							HeyyCzer
						</Link>
					</p>

					<Link
						href="https://www.buymeacoffee.com/heyyczer"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png"
							alt="Buy Me A Coffee"
							width={0}
							height={0}
							sizes="512px"
							className="hover:opacity-70 hover:bg-black rounded-lg transition-all hover:scale-105"
							style={{ width: "auto", height: "40px" }} // optional
						/>
					</Link>
				</footer>
			</body>
		</html>
	);
}
