import Image from "next/image";
import Link from "next/link";

export default function Footer() {
	return (
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
					style={{ width: "auto", height: "40px" }}
				/>
			</Link>
		</footer>
	);
}
