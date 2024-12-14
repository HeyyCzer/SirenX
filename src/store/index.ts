import { createColor } from "@/controllers/colors.controller";
import { configureStore } from "@reduxjs/toolkit";
import * as Sentry from "@sentry/react";
import editorSlice from "./reducers/editor.reducer";
import settingsSlice from "./reducers/settings.reducer";
import tutorialSlice from "./reducers/tutorial.reducer";

export const STORE_KEY = "SirenX//";

export const makeStore = () => {
	const sentryReduxEnhancer = Sentry.createReduxEnhancer();

	const getPreloadedState = (key: string) => {
		if (typeof window === "undefined") return undefined;
		const data = localStorage.getItem(`${STORE_KEY}${key}`);
		return data ? JSON.parse(data) : undefined;
	};

	const preloadedEditor = getPreloadedState("editor");
	if (preloadedEditor) {
		for (const row of Object.values(preloadedEditor.lights ?? {})) {
			for (const item of Object.values(row ?? {})) {
				if (item?.color?.startsWith("CUSTOM_")) {
					createColor(item.color.replace("CUSTOM_", ""));
				}
			}
		}
	}

	const store = configureStore({
		reducer: {
			editor: editorSlice,
			settings: settingsSlice,
			tutorial: tutorialSlice,
		},
		preloadedState: {
			editor: preloadedEditor,
			tutorial: getPreloadedState("tutorial"),
		},
		enhancers: (getDefaultEnhancers) =>
			getDefaultEnhancers().concat(sentryReduxEnhancer),
	});

	store.subscribe(() => {
		if (typeof window !== "undefined") {
			const state = store.getState();
			localStorage.setItem(`${STORE_KEY}editor`, JSON.stringify(state.editor));
			localStorage.setItem(
				`${STORE_KEY}tutorial`,
				JSON.stringify(state.tutorial),
			);
		}
	});

	return store;
};
