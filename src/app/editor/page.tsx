"use client";

import { Suspense, useEffect } from "react";
import SeparatorsContainer from "@/app/editor/components/SeparatorsContainer";
import Toolbar from "@/app/editor/components/Toolbar";
import AppTutorial from "@/app/editor/components/Tutorial";
import MainLayout from "@/components/MainLayout";
import MeshGradient from "@/components/MeshGradient";
import { useOneColorPerColumn, usePreventContextMenu } from "@/hooks/useEditor";
import { restoreCustomColors } from "@/services/color-manager.service";
import { loadBuyMeCoffeeWidget } from "@/utils/donations";
import Editor from "./components/Editor";

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
				<AppTutorial />
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
