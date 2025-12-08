"use client";

import { m } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
	return (
		<m.footer
			className="flex flex-col items-center justify-center gap-4 border-t border-white/5 bg-slate-900/50 py-6 backdrop-blur-sm"
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
		>
			<p className="text-center text-sm text-white/40">
				Made with{" "}
				<m.span
					className="inline-block text-emerald-400"
					animate={{ scale: [1, 1.2, 1] }}
					transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
				>
					💚
				</m.span>{" "}
				by{" "}
				<Link
					href="https://bio.site/HeyyCzer"
					className="font-semibold text-white/60 underline underline-offset-2 transition-colors hover:text-emerald-400"
				>
					HeyyCzer
				</Link>
			</p>

			<m.div
				whileHover={{ scale: 1.05 }}
				transition={{ type: "spring", stiffness: 300 }}
			>
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
						className="rounded-lg opacity-80 transition-opacity hover:opacity-100"
						style={{ width: "auto", height: "36px" }}
					/>
				</Link>
			</m.div>
		</m.footer>
	);
}
