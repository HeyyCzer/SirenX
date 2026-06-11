"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import MeshGradient from "@/components/MeshGradient";
import { useOneColorPerColumn, usePreventContextMenu } from "@/hooks/useEditor";
import { restoreCustomColors } from "@/services/color-manager.service";
import { loadBuyMeCoffeeWidget } from "@/utils/donations";

const Editor = dynamic(() => import("./components/Editor"), {
	loading: () => (
		<div className="min-h-[600px] w-full animate-pulse rounded-lg bg-slate-800/50" />
	),
});

const SeparatorsContainer = dynamic(
	() => import("./components/SeparatorsContainer"),
);

const Toolbar = dynamic(() => import("./components/Toolbar"), {
	loading: () => (
		<div className="h-[600px] w-[200px] animate-pulse rounded-lg bg-slate-800/50" />
	),
});

const EditorTutorial = dynamic(() => import("./components/Tutorial"));

export default function EditorPage() {
	useEffect(() => {
		loadBuyMeCoffeeWidget();
		restoreCustomColors();
	}, []);

	usePreventContextMenu();
	useOneColorPerColumn();

	return (
		<MainLayout hideFooter>
			<MeshGradient />
			{/* <FeedbackWidget key={"sentry-feedback"} /> */}

			<Suspense fallback={null}>
				<SeparatorsContainer />
			</Suspense>
			<Suspense fallback={null}>
				<EditorTutorial />
			</Suspense>

			<div className="relative min-h-screen px-6 py-9 lg:px-12">
				<div className="flex justify-between gap-x-6">
					<Suspense
						fallback={
							<div className="h-6 w-24 animate-pulse rounded bg-slate-800/50" />
						}
					>
						<Editor />
					</Suspense>
					<Suspense
						fallback={
							<div className="h-6 w-24 animate-pulse rounded bg-slate-800/50" />
						}
					>
						<Toolbar />
					</Suspense>
				</div>
			</div>

			<div id="supportByBMC" />
		</MainLayout>
	);
}
