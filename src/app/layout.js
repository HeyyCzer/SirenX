import Image from "next/image";
import Link from "next/link";
import "./fonts.css";
import "./globals.css";
import "./modals.css";

import GoogleAnalytics from "@/components/GoogleAnalytics";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
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

				{children}

				<footer className="flex flex-col items-center justify-center gap-4 bg-slate-900 py-4">
					<p className="text-center text-gray-300/60 text-sm">
						Made with{" "}
						<span className="animate-ping bg-emerald-400 bg-clip-text text-transparent">
							💚
						</span>{" "}
						by{" "}
						<Link
							href="https://bio.site/HeyyCzer"
							className="font-bold text-white underline underline-offset-2 transition-all hover:text-emerald-400"
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
							className="rounded-lg transition-all hover:scale-105 hover:bg-black hover:opacity-80"
							style={{ width: "auto", height: "40px" }} // optional
						/>
					</Link>
				</footer>
			</body>
		</html>
	);
}
