import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface SponsorModalProps {
	isOpen: boolean;
	closeModal: () => void;
}

export default function SponsorModal({ isOpen, closeModal }: SponsorModalProps) {
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeModal();
		}
		window.addEventListener("keydown", handleKeyDown);

		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = "auto";
			window.removeEventListener("keydown", handleKeyDown);
		}
	}, [isOpen]);

	return (
		<AnimatePresence>
			{
				isOpen && (
					<>
						<motion.div
							key="sponsor-modal-overlay"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{
								opacity: 0,
							}}
							
							className="fixed top-0 left-0 w-full h-full bg-black/70 z-[100] cursor-pointer" onClick={closeModal}
						/>

						<motion.div
							key="sponsor-modal"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1.0 }}
							exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
							className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 rounded-lg z-[110]"
						>
							<div className="relative py-4 px-8 flex flex-col h-full w-[26rem] min-h-96 max-h-full gap-y-3">
								<button type="button" onClick={closeModal} className="absolute top-3 right-4 text-white/40 text-lg">
									<FontAwesomeIcon icon={faXmark} className="p-1" />
								</button>
								
								<div className="flex flex-col items-center justify-center pt-8 pb-2">
									<div>
										<FontAwesomeIcon icon={faHeartRegular} className="text-pink-600 text-xl -rotate-45" />
										<FontAwesomeIcon icon={faHeartRegular} className="text-pink-600 text-3xl" />
										<FontAwesomeIcon icon={faHeartRegular} className="text-pink-600 text-xl rotate-45" />
									</div>
									<h2 className="text-2xl font-bold text-white">Sponsor this project</h2>
								</div>

								<p className="text-white text-base text-center">
									If you <span className="font-medium">like this project</span>, please <span className="font-medium">consider supporting it</span>!
								</p>
								<p className="text-white text-base text-center">
									It's completely optional, but by doing this you will help me continue working on this project and make it even better.
								</p>

								<div className="py-2 mt-auto flex flex-col items-center justify-between space-y-4 h-full">
									<div className="text-sm flex gap-x-2">
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
												className="hover:opacity-80 hover:bg-black rounded-lg transition-all"
												style={{ width: "auto", height: "40px" }} // optional
											/>
										</Link>
										<Link
											href="https://github.com/sponsors/heyyczer"
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center justify-center gap-x-2 px-4 py-2 bg-pink-600 text-white rounded-md"
										>
											<FontAwesomeIcon icon={faHeartSolid} className="text-white" />
											Github Sponsors
										</Link>
									</div>
									<div>
										<button type="button" onClick={closeModal} className="px-4 py-2 text-white/50 text-sm rounded-md hover:bg-white/5 transition-colors">
											Don't show this again for 15 days
										</button>
									</div>
								</div>
							</div>
						</motion.div>
					</>
				)
			}
		</AnimatePresence>
	)
}