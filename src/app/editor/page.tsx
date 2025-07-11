"use client";

import FeedbackWidget from "@/app/editor/components/SentryFeedback";
import MainLayout from "@/components/MainLayout";
import { useOneColorPerColumn, usePreventContextMenu } from "@/hooks/useEditor";
import { loadBuyMeCoffeeWidget } from "@/utils/donations";
import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styles from "./Editor.module.css";

const Editor = dynamic(() => import("@/app/editor/components/Editor"), {
	ssr: false,
	loading: () => (
		<div className="min-h-[600px] w-full animate-pulse rounded-lg bg-slate-800/50" />
	),
});

const SeparatorsContainer = dynamic(
	() => import("@/app/editor/components/SeparatorsContainer"),
	{
		ssr: false,
	},
);

const Toolbar = dynamic(() => import("@/app/editor/components/Toolbar"), {
	ssr: false,
	loading: () => (
		<div className="h-[600px] w-[200px] animate-pulse rounded-lg bg-slate-800/50" />
	),
});

const EditorTutorial = dynamic(() => import("./components/Tutorial"), {
	ssr: false,
});

export default function EditorPage() {
	useEffect(() => {
		loadBuyMeCoffeeWidget();
	}, []);

	usePreventContextMenu();
	useOneColorPerColumn();

	return (
		<MainLayout hideFooter>
			<FeedbackWidget key={"sentry-feedback"} />

			<DndProvider backend={HTML5Backend}>
				<Suspense fallback={null}>
					<SeparatorsContainer />
				</Suspense>
				<Suspense fallback={null}>
					<EditorTutorial />
				</Suspense>

				<div className={`${styles.background} min-h-screen px-12 py-9`}>
					<div className="flex justify-between gap-x-6">
						<Suspense fallback={<div className="h-6 w-24 animate-pulse rounded bg-slate-800/50" />}>
							<Editor />
						</Suspense>
						<Suspense fallback={<div className="h-6 w-24 animate-pulse rounded bg-slate-800/50" />}>
							<Toolbar />
						</Suspense>
					</div>
				</div>

				<div id="supportByBMC" />
			</DndProvider>
		</MainLayout>
	);
}
