"use client";

import MainLayout from "@/components/shared/MainLayout";
import { useOneColorPerColumn, usePreventContextMenu } from "@/hooks/useEditor";
import { loadBuyMeCoffeeWidget } from "@/utils/donations";
import { useProgressiveLoading } from "@/utils/progressive-loading";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styles from "./Editor.module.css";

// Importações dinâmicas com carregamento controlado para melhorar o desempenho
const Editor = dynamic(() => import("@/components/Editor"), {
	ssr: false,
	loading: () => (
		<div className="min-h-[600px] w-full animate-pulse rounded-lg bg-slate-800/50" />
	),
});

const SeparatorsContainer = dynamic(
	() => import("@/components/SeparatorsContainer"),
	{
		ssr: false,
	},
);

const Toolbar = dynamic(() => import("@/components/Toolbar"), {
	ssr: false,
	loading: () => (
		<div className="h-[600px] w-[200px] animate-pulse rounded-lg bg-slate-800/50" />
	),
});

const AppTutorial = dynamic(() => import("./editor.tutorial"), {
	ssr: false,
});

export default function EditorPage() {
	// Usar o sistema de carregamento progressivo com tempos escalonados
	const componentsLoaded = useProgressiveLoading({
		components: ["editor", "toolbar", "separators", "tutorial", "donations"],
		delays: [200, 800, 1200, 1500, 2000],
	});

	// Buy me a coffee widget - carregar quando estiver pronto
	useEffect(() => {
		if (componentsLoaded.donations) {
			loadBuyMeCoffeeWidget();
		}
	}, [componentsLoaded.donations]);

	// Prevenir menu de contexto padrão
	usePreventContextMenu();

	// Usar o hook de cores por coluna
	useOneColorPerColumn();

	// Registrar o progresso do carregamento
	useEffect(() => {
		if (componentsLoaded.editor) {
			console.log("Editor carregado, interface principal disponível");
		}
	}, [componentsLoaded.editor]);

	return (
		<MainLayout hideFooter>
			<DndProvider backend={HTML5Backend}>
				{componentsLoaded.separators && <SeparatorsContainer />}
				{componentsLoaded.tutorial && <AppTutorial />}

				<div className={`${styles.background} min-h-screen px-12 py-9`}>
					<div className="flex justify-between gap-x-6">
						{componentsLoaded.editor ? (
							<Editor />
						) : (
							<div className="h-[600px] min-w-[600px] animate-pulse rounded-lg bg-slate-800/50" />
						)}
						{componentsLoaded.toolbar ? (
							<Toolbar />
						) : (
							<div className="h-[600px] w-[200px] animate-pulse rounded-lg bg-slate-800/50" />
						)}
					</div>
				</div>

				<div id="supportByBMC" />
			</DndProvider>
		</MainLayout>
	);
}
