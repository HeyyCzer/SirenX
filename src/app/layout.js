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
			<body className="dark bg-slate-950" suppressHydrationWarning>
				<GoogleAnalytics />
				{children}
			</body>
		</html>
	);
}
