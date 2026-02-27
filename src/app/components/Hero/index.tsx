"use client";

import { faEdit, faHourglass2 } from "@fortawesome/pro-regular-svg-icons";
import {
	faAngleDoubleDown,
	faMagicWandSparkles,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { m } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import screenshot from "../../../../public/images/home/screenshot.gif";

export default function Hero() {
	return (
		<section className="relative flex min-h-[90vh] w-full items-center justify-center px-6 py-16 lg:px-12 xl:px-24">
			<div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-16 lg:flex-row lg:gap-24">
				{/* Left content */}
				<m.div
					className="z-10 flex flex-col items-center text-center lg:items-start lg:text-left"
					initial={{ opacity: 0, x: -30 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
				>
					<m.span
						className="rounded-full border border-emerald-400/60 bg-emerald-400/10 px-4 py-1.5 text-[13px] text-emerald-400 leading-none backdrop-blur-sm"
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.2 }}
					>
						<FontAwesomeIcon icon={faHourglass2} className="mr-2" />
						Save your time
					</m.span>

					<m.h1
						className="mt-4 mb-6 font-bold text-6xl leading-none md:text-7xl lg:text-8xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
					>
						<span className="animate-siren text-white [animation-delay:0.70s]">
							Siren
						</span>
						<span className="animate-siren2 text-white">X</span>
					</m.h1>

					<m.p
						className="max-w-md text-lg text-white/50 md:text-xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
					>
						Ease, simplicity and time-saving.
						<br />
						Your brand new{" "}
						<span className="font-semibold text-emerald-400">carcols.meta</span>{" "}
						editor.
					</m.p>

					<m.div
						className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.5 }}
					>
						<Link
							href="#features"
							className="group flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-sm text-white uppercase tracking-wide transition-all duration-300 hover:bg-emerald-400 hover:shadow-emerald-500/25 hover:shadow-lg"
						>
							<FontAwesomeIcon
								icon={faMagicWandSparkles}
								className="transition-transform group-hover:rotate-12"
							/>
							Features
						</Link>
						<Link
							href="/editor"
							className="group flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 font-semibold text-sm text-white uppercase tracking-wide backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10"
						>
							<FontAwesomeIcon
								icon={faEdit}
								className="transition-transform group-hover:scale-110"
							/>
							Open Editor
						</Link>
					</m.div>
				</m.div>

				{/* Right content - Screenshot */}
				<m.div
					className="relative hidden lg:block"
					initial={{ opacity: 0, x: 30, scale: 0.95 }}
					animate={{ opacity: 1, x: 0, scale: 1 }}
					transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
				>
					<div className="relative">
						{/* Glow effect behind image */}
						<div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-2xl" />

						<Image
							unoptimized
							src={screenshot}
							alt="SirenX Editor Screenshot"
							className="relative w-full min-w-[450px] max-w-[700px] rounded-xl border border-white/10 bg-gray-900/50 p-2 shadow-2xl backdrop-blur-sm xl:max-w-[800px]"
						/>
					</div>
				</m.div>
			</div>

			{/* Scroll indicator */}
			<m.div
				className="absolute bottom-8 left-1/2 -translate-x-1/2"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1, duration: 0.5 }}
			>
				<Link
					href="#about"
					className="flex flex-col items-center gap-2 text-white/40 transition-colors hover:text-white/60"
				>
					<span className="text-xs uppercase tracking-widest">Scroll</span>
					<m.div
						animate={{ y: [0, 8, 0] }}
						transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
					>
						<FontAwesomeIcon icon={faAngleDoubleDown} size="lg" />
					</m.div>
				</Link>
			</m.div>
		</section>
	);
}
