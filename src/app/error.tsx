"use client";

import { STORE_KEY } from "@/store";


export default function ErrorPage({
	error,
	reset
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	return (
		<div className="flex flex-col h-screen bg-gray-900 text-white items-center justify-center w-full">
			<h1 className="text-cyan-400 font-semibold text-xl">Oops! An error occurred.</h1>
			<p>We are sorry for the inconvenience. Please try again later.</p>

			<div>
				<button
					type="button"
					onClick={() => {
						localStorage.removeItem(`${STORE_KEY}editor`);
						window.location.reload();
					}}
					className="mt-4 bg-cyan-400/40 hover:bg-cyan-400/80 hover:text-black transition-colors font-medium px-4 py-2 rounded-md"
				>
					Clear my editor
				</button>
			</div>

			{error.digest ? (
				<p>
					Error ID: <code>{error.digest}</code>
				</p>
			) : null}
		</div>
	)
}