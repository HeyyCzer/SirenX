"use client";

import { m } from "motion/react";

export default function MeshGradient() {
	return (
		<div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
			{/* Noise overlay to reduce banding */}
			<div
				className="absolute inset-0 opacity-[0.015]"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
				}}
			/>

			{/* Primary blob - emerald with radial gradient */}
			<m.div
				className="absolute -top-32 -left-32 h-[700px] w-[700px]"
				style={{
					background:
						"radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 30%, rgba(16, 185, 129, 0.02) 60%, transparent 80%)",
				}}
				animate={{
					x: [0, 100, 50, 0],
					y: [0, 50, 100, 0],
					scale: [1, 1.1, 0.95, 1],
				}}
				transition={{
					duration: 20,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>

			{/* Secondary blob - cyan with radial gradient */}
			<m.div
				className="absolute top-1/4 -right-1/4 h-[600px] w-[600px]"
				style={{
					background:
						"radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(6, 182, 212, 0.08) 30%, rgba(6, 182, 212, 0.02) 60%, transparent 80%)",
				}}
				animate={{
					x: [0, -80, -40, 0],
					y: [0, 80, 40, 0],
					scale: [1, 0.9, 1.05, 1],
				}}
				transition={{
					duration: 25,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>

			{/* Tertiary blob - emerald darker with radial gradient */}
			<m.div
				className="absolute bottom-0 left-1/3 h-[500px] w-[500px]"
				style={{
					background:
						"radial-gradient(circle, rgba(5, 150, 105, 0.12) 0%, rgba(5, 150, 105, 0.06) 30%, rgba(5, 150, 105, 0.01) 60%, transparent 80%)",
				}}
				animate={{
					x: [0, 60, -30, 0],
					y: [0, -60, -30, 0],
					scale: [1, 1.15, 0.9, 1],
				}}
				transition={{
					duration: 18,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>

			{/* Accent blob - teal with radial gradient */}
			<m.div
				className="absolute top-1/2 left-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2"
				style={{
					background:
						"radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, rgba(20, 184, 166, 0.06) 30%, rgba(20, 184, 166, 0.01) 60%, transparent 80%)",
				}}
				animate={{
					x: ["-50%", "-40%", "-60%", "-50%"],
					y: ["-50%", "-60%", "-40%", "-50%"],
					scale: [1, 1.2, 0.85, 1],
				}}
				transition={{
					duration: 22,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
		</div>
	);
}
