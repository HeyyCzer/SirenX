"use client";

import { STORE_KEY } from "@/store/constants";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
	error,
}: Readonly<{
	error: Error & { digest?: string }
}>) {
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<html lang="en">
			<body>
				<div className="flex h-screen w-full flex-col items-center justify-center bg-gray-900 text-white">
					<h1 className="font-semibold text-cyan-400 text-xl">
						Oops! An error occurred.
					</h1>
					<p>We are sorry for the inconvenience. Please try again later.</p>

					<div>
						<button
							type="button"
							onClick={() => {
								localStorage.removeItem(`${STORE_KEY}editor`);
								window.location.reload();
							}}
							className="mt-4 rounded-md bg-cyan-400/40 px-4 py-2 font-medium transition-colors hover:bg-cyan-400/80 hover:text-black"
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
			</body>
		</html>
	);
}
