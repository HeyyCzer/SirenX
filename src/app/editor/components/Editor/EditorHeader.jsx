"use client";

import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faHome, faStar } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EditorHeader() {
	const [count, setCount] = useState(0);
	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(
				"https://api.github.com/repos/heyyczer/sirenx",
			);
			const data = await response.json();
			setCount(data.stargazers_count);
		};
		fetchData();
	}, []);

	return (
		<div className="flex items-center gap-x-4">
			<Link
				href="/"
				className="group flex items-center gap-x-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
			>
				<FontAwesomeIcon
					icon={faHome}
					className="text-white/60 transition-colors group-hover:text-emerald-400"
				/>
				<span className="font-bold text-lg text-white leading-none">
					Siren<span className="text-emerald-400">X</span>
				</span>
			</Link>

			<Link
				href="https://github.com/heyyczer/sirenx"
				rel="noopener"
				target="_blank"
				className="flex items-center gap-x-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white/60 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
			>
				<FontAwesomeIcon icon={faGithub} />
				<span className="text-sm">
					Star on GitHub
					<span className="ml-2 text-white/40 text-xs">
						<FontAwesomeIcon icon={faStar} /> {count}
					</span>
				</span>
			</Link>
		</div>
	);
}
