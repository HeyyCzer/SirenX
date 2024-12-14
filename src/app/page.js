"use client";

import { faEdit } from "@fortawesome/free-regular-svg-icons";
import {
	faAngleDoubleDown,
	faMagicWandSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import styles from "./Home.module.css";

import { faHourglass2 } from "@fortawesome/free-regular-svg-icons";
import { motion } from "motion/react";
import heroCharacters from "/public/images/home/characters.png";
import screenshot from "/public/images/home/screenshot.gif";

export default function Home() {
	useEffect(() => {
		const handleScroll = () => {
			const heroBackground = document.querySelector(
				`.${styles.heroBackground}`,
			);
			if (heroBackground) {
				const scroll = window.scrollY;
				const scrollMax = 260;

				let target = scroll * 0.6;
				if (target > scrollMax) target = scrollMax;
				heroBackground.style.transform = `translateY(${target}px)`;
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<main className="min-h-screen">
			<section className={styles.heroContainer}>
				<div className="-translate-y-1/2 -translate-x-1/2 absolute top-1/2 left-1/2 z-50 flex w-full flex-col items-center xl:left-0 xl:block xl:translate-x-0 xl:pl-56">
					<span className="rounded-full border border-emerald-400 px-4 py-0.5 text-[13px] text-emerald-400 leading-none">
						<FontAwesomeIcon icon={faHourglass2} className="mr-2" />
						Save your time
					</span>
					<h1 className="mt-1 mb-4 font-bold text-[72px] leading-none">
						<span className="animate-siren text-white [animation-delay:0.70s]">
							Siren
						</span>
						<span className="animate-siren2 text-white">X</span>
					</h1>

					<p className="text-center text-white/45 text-xl tracking-wide xl:text-left">
						Ease, simplicity and time-saving. <br />
						Your brand new and time-saving{" "}
						<span className="font-semibold text-gradient-primary">
							carcols.meta
						</span>{" "}
						editor.
						<br />
					</p>

					<div className="mt-8 flex gap-4">
						<Link
							href="#features"
							className="rounded-md bg-emerald-500 px-8 py-2 font-semibold text-sm text-white uppercase tracking-wide transition-all hover:bg-emerald-600"
						>
							<FontAwesomeIcon icon={faMagicWandSparkles} className="mr-2" />
							Features
						</Link>
						<Link
							href="/editor"
							className="rounded-md bg-white px-8 py-2 font-semibold text-black text-sm uppercase tracking-wide transition-all hover:bg-gray-200"
						>
							<FontAwesomeIcon icon={faEdit} className="mr-2" />
							Open Editor
						</Link>
					</div>
				</div>

				<Image
					src={heroCharacters}
					alt="Characters"
					className={`absolute right-0 bottom-0 w-[600px] opacity-80 2xl:w-[900px] ${styles.heroCharacters} hidden xl:block`}
				/>

				<div
					className={styles.heroBackground}
					style={{ background: `url(/images/home/bg.png)` }}
					suppressHydrationWarning
				/>

				<div className="absolute right-0 bottom-0 left-0 mb-8 flex justify-center gap-4">
					<Link href="#features" className="animate-bounce text-white">
						<FontAwesomeIcon icon={faAngleDoubleDown} size="2x" />
					</Link>
				</div>
			</section>

			<section
				id="about"
				className="grid grid-cols-1 gap-20 px-12 py-16 xl:px-20 2xl:grid-cols-2"
			>
				<div>
					<motion.h2
						className="mb-12 text-center font-bold text-3xl text-gray-400"
						initial={{ scale: 0.0 }}
						whileInView={{ scale: 1 }}
						viewport={{ once: true, margin: "-100px" }}
					>
						What is{" "}
						<span className="mr-0.5 text-white">
							Siren<span className="text-gradient-primary">X</span>
						</span>
						?
					</motion.h2>

					<motion.p
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true, margin: "-100px" }}
						className="text-center text-white/60 text-xl"
					>
						<span className="font-bold text-white">SirenX</span> is a web-based{" "}
						<span className="font-bold text-gradient-primary">
							carcols.meta
						</span>{" "}
						editor, designed to make it easier to create and edit vehicle light
						patterns for{" "}
						<span className="font-bold text-gradient-primary">
							Grand Theft Auto V
						</span>{" "}
						and <span className="font-bold text-gradient-primary">FiveM</span>{" "}
						servers. We offer a simple and intuitive interface, so you can
						create your patterns in a few clicks.
					</motion.p>
				</div>

				<div className="perspective-1000">
					<Image
						src={screenshot}
						alt="Screenshot"
						className="2xl:transform-style-3d 2xl:-rotate-y-[20deg] backface-hidden mx-auto w-2/3 max-w-[600px] rounded-lg border border-gray-700/70 bg-gray-500/20 p-2"
					/>
				</div>
			</section>

			<section id="features" className="px-12 py-16 xl:px-20">
				<h2 className="mb-12 text-center font-bold text-3xl text-gray-400">
					Why should you choose{" "}
					<span className="mr-0.5 text-white">
						Siren<span className="text-gradient-primary">X</span>
					</span>
					?
				</h2>

				<div className="grid grid-cols-2 gap-12 2xl:grid-cols-4">
					<motion.div
						viewport={{ once: true, margin: "-100px" }}
						initial={{ scale: 0.0 }}
						whileInView={{ scale: 1.0 }}
						transition={{ delay: 0.25 }}
						className="h-auto rounded-lg border border-gray-700/70 bg-gray-500/20 px-8 py-6 text-center"
					>
						<h1 className="text-[32px]">🧠</h1>

						<h2 className="font-bold text-white tracking-wider">
							Easy to learn and use
						</h2>

						<p className="mt-4 text-white/60">
							We designed <span className="font-bold text-white">SirenX</span>{" "}
							to be as simple as possible, so you can use it without any hassle.
							You don&apos;t need to be an expert to use it: just open the
							editor, import your{" "}
							<kbd>
								<kbd>carcols.meta</kbd>
							</kbd>{" "}
							file, or just start creating a new one.
						</p>
					</motion.div>
					<motion.div
						viewport={{ once: true, margin: "-100px" }}
						initial={{ scale: 0.0 }}
						whileInView={{ scale: 1 }}
						transition={{ delay: 0.5 }}
						className="h-auto rounded-lg border border-gray-700/70 bg-gray-500/20 px-8 py-6 text-center"
					>
						<h1 className="text-[32px]">⌛</h1>

						<h2 className="font-bold text-white tracking-wider">
							Save your time
						</h2>

						<p className="mt-4 text-white/60">
							We know how time-consuming it is to manually create/edit vehicle
							light patterns.{" "}
							<span className="font-bold text-white">SirenX</span> is here to
							save your time. You can edit your{" "}
							<kbd>
								<kbd>carcols.meta</kbd>
							</kbd>{" "}
							file in a few clicks, and download it back to your computer. Spend
							your time on more important things.
						</p>
					</motion.div>
					<motion.div
						viewport={{ once: true, margin: "-100px" }}
						initial={{ scale: 0.0 }}
						whileInView={{ scale: 1 }}
						transition={{ delay: 0.75 }}
						className="h-auto rounded-lg border border-gray-700/70 bg-gray-500/20 px-8 py-6 text-center"
					>
						<h1 className="text-[32px]">💰</h1>

						<h2 className="font-bold text-white tracking-wider">
							Absolutely free
						</h2>

						<p className="mt-4 text-white/60">
							We believe that everyone should have access to the best tools, so
							we made <span className="font-bold text-white">SirenX</span>{" "}
							absolutely free. You can use it as much as you want. If you like
							it, you can support us by sharing it with your friends or using
							the support button (on all pages footer or in the right-corner on
							the editor page)
						</p>
					</motion.div>
					<motion.div
						viewport={{ once: true, margin: "-100px" }}
						initial={{ scale: 0.0 }}
						whileInView={{ scale: 1 }}
						transition={{ delay: 1.0 }}
						className="h-auto rounded-lg border border-gray-700/70 bg-gray-500/20 px-8 py-6 text-center"
					>
						<h1 className="text-[32px]">🔧</h1>

						<h2 className="font-bold text-white tracking-wider">
							Advanced features
						</h2>

						<p className="mt-4 text-white/60">
							In addition to colors, we provide other options to customize your
							patterns, such as: direction, intensity and even multiples. We are
							constantly working on new features to make{" "}
							<span className="font-bold text-white">SirenX</span> even better.
							If you have any suggestions, feel free to contact us.
						</p>
					</motion.div>
				</div>
			</section>
		</main>
	);
}
