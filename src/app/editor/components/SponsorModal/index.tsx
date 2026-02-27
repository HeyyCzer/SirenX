import { faHeart as faHeartRegular } from "@fortawesome/pro-regular-svg-icons";
import {
	faHeart as faHeartSolid,
	faXmark,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface SponsorModalProps {
	isOpen: boolean;
	closeModal: () => void;
}

export default function SponsorModal({
	isOpen,
	closeModal,
}: SponsorModalProps) {
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeModal();
		};
		window.addEventListener("keydown", handleKeyDown);

		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = "auto";
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, closeModal]);

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						key="sponsor-modal-overlay"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{
							opacity: 0,
						}}
						className="fixed top-0 left-0 z-[100] h-full w-full cursor-pointer bg-black/70"
						onClick={closeModal}
					/>

					<motion.div
						key="sponsor-modal"
						id="sponsor-modal"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1.0 }}
						exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
						className="fixed top-1/2 left-1/2 z-[110] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-slate-900"
					>
						<div className="relative flex h-full max-h-full min-h-96 w-[26rem] flex-col gap-y-3 px-8 py-4">
							<button
								type="button"
								onClick={closeModal}
								className="absolute top-3 right-4 text-lg text-white/40"
							>
								<FontAwesomeIcon icon={faXmark} className="p-1" />
							</button>

							<div className="flex flex-col items-center justify-center pt-8 pb-2">
								<div>
									<FontAwesomeIcon
										icon={faHeartRegular}
										className="-rotate-45 text-pink-600 text-xl"
									/>
									<FontAwesomeIcon
										icon={faHeartRegular}
										className="text-3xl text-pink-600"
									/>
									<FontAwesomeIcon
										icon={faHeartRegular}
										className="rotate-45 text-pink-600 text-xl"
									/>
								</div>
								<h2 className="font-bold text-2xl text-white">
									Sponsor this project
								</h2>
							</div>

							<p className="text-center text-base text-white">
								If you <span className="font-medium">like this project</span>,
								please{" "}
								<span className="font-medium">consider supporting it</span>!
							</p>
							<p className="text-center text-base text-white">
								It's completely optional, but by doing this you will help me
								continue working on this project and make it even better.
							</p>

							<div className="mt-auto flex h-full flex-col items-center justify-between space-y-4 py-2">
								<div className="flex gap-x-2 text-sm">
									<Link
										href="https://www.buymeacoffee.com/heyyczer"
										target="_blank"
										rel="noopener noreferrer"
									>
										<Image
											src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png"
											alt="Buy Me A Coffee"
											width={0}
											height={0}
											sizes="512px"
											className="rounded-lg transition-all hover:bg-black hover:opacity-80"
											style={{ width: "auto", height: "40px" }} // optional
										/>
									</Link>
									<Link
										href="https://github.com/sponsors/heyyczer"
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center justify-center gap-x-2 rounded-md bg-pink-600 px-4 py-2 text-white"
									>
										<FontAwesomeIcon
											icon={faHeartSolid}
											className="text-white"
										/>
										Github Sponsors
									</Link>
								</div>
								<div>
									<button
										type="button"
										onClick={closeModal}
										className="rounded-md px-4 py-2 text-sm text-white/50 transition-colors hover:bg-white/5"
									>
										Don't show this again for 15 days
									</button>
								</div>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
