import { createColor } from "@/controllers/colors.controller";
import DefaultCarcols from "@/default_carcols.json";
import DeltaEnum from "@/enum/direction.enum";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EditorState {
	sirenId: string | null;
	sirenName: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	uploadedFile: any;
	selectedColor: string;
	bpm: number;
	lights: {
		[key: number]: {
			[key: number]: {
				color: string;
				direction: number;
				multiples: number;
				intensity: number;
				scaleFactor: number;
			};
		};
	};

	setUploadData: (data: { id: string; name: string; file: any }) => void;
	setCurrentBpm: (bpm: number) => void;
	setSelectedColor: (color: string) => void;
	updateLight: (data: {
		row: number;
		column: number;
		color: string;
		isOneColorPerColumn: { value: boolean };
	}) => void;
	updateLights: (lights: EditorState["lights"]) => void;
}


export const defaultLightModel = {
	color: "none",
	direction: DeltaEnum.FRONT.delta,
	multiples: 1,
	intensity: 3.5,
	scaleFactor: 100,
};

export const defaultCarcolsLightModel = {
	rotation: {
		delta: {
			$: {
				value: "0.00000000",
			},
		},
		start: {
			$: {
				value: "0.00000000",
			},
		},
		speed: {
			$: {
				value: "3.00000000",
			},
		},
		sequencer: {
			$: {
				value: "4294967295",
			},
		},
		multiples: {
			$: {
				value: "1",
			},
		},
		direction: {
			$: {
				value: "false",
			},
		},
		syncToBpm: {
			$: {
				value: "true",
			},
		},
	},
	flashiness: {
		delta: {
			$: {
				value: "3.14159300",
			},
		},
		start: {
			$: {
				value: "0.00000000",
			},
		},
		speed: {
			$: {
				value: "0.00000000",
			},
		},
		sequencer: {
			$: {
				value: "2863486250",
			},
		},
		multiples: {
			$: {
				value: "2",
			},
		},
		direction: {
			$: {
				value: "true",
			},
		},
		syncToBpm: {
			$: {
				value: "true",
			},
		},
	},
	corona: {
		intensity: {
			$: {
				value: "25.00000000",
			},
		},
		size: {
			$: {
				value: "0.50000000",
			},
		},
		pull: {
			$: {
				value: "0.15000000",
			},
		},
		faceCamera: {
			$: {
				value: "false",
			},
		},
	},
	color: {
		$: {
			value: "0xFFFF9500",
		},
	},
	intensity: {
		$: {
			value: "1.00000000",
		},
	},
	lightGroup: {
		$: {
			value: "1",
		},
	},
	rotate: {
		$: {
			value: "false",
		},
	},
	scale: {
		$: {
			value: "true",
		},
	},
	scaleFactor: {
		$: {
			value: "2",
		},
	},
	flash: {
		$: {
			value: "true",
		},
	},
	light: {
		$: {
			value: "false",
		},
	},
	spotLight: {
		$: {
			value: "false",
		},
	},
	castShadows: {
		$: {
			value: "false",
		},
	},
};

export const STORE_KEY = "SirenX//";

// Initialize custom colors from localStorage if available
if (typeof window !== "undefined") {
	const data = localStorage.getItem(`${STORE_KEY}editor`);
	if (data) {
		const preloadedEditor = JSON.parse(data);
		if (preloadedEditor) {
			for (const row of Object.values(preloadedEditor.lights ?? {})) {
				for (const item of Object.values(row ?? {})) {
					if (item?.color?.startsWith("CUSTOM_")) {
						createColor(item.color.replace("CUSTOM_", ""));
					}
				}
			}
		}
	}
}

export const useEditorStore = create<EditorState>()(
	persist(
		(set) => ({
			sirenId: null,
			sirenName: "SirenX-GeneratedCarcols",
			uploadedFile: DefaultCarcols,
			selectedColor: "red",
			bpm: 600,
			lights: Object.fromEntries(
				Array.from({ length: 32 }, (_, i) => [
					i,
					Object.fromEntries(
						Array.from({ length: 20 }, (_, j) => [j, defaultLightModel]),
					),
				]),
			),

			// Actions
			setUploadData: ({ id, name, file }) =>
				set({ sirenId: id, sirenName: name, uploadedFile: file }),

			setCurrentBpm: (bpm) =>
				set({ bpm }),

			setSelectedColor: (color) =>
				set({ selectedColor: color }),

			updateLight: ({ row, column, color, isOneColorPerColumn }) =>
				set((state) => {
					const newLights = { ...state.lights };

					if (!newLights[row]) {
						newLights[row] = [];
					}

					if (!newLights[row][column]) {
						newLights[row][column] = defaultLightModel;
					}

					if (isOneColorPerColumn.value) {
						for (const rowKey of Object.keys(newLights)) {
							const currentRow = newLights[rowKey as any];
							if (
								currentRow[column]?.color &&
								currentRow[column]?.color !== color &&
								color !== "none" &&
								currentRow[column]?.color !== "none"
							) {
								currentRow[column] = {
									...currentRow[column],
									color: color
								};
							}
						}
					}

					newLights[row][column] = {
						...newLights[row][column],
						color: color
					};

					return { lights: newLights };
				}),

			updateLights: (lights) =>
				set({ lights }),
		}),
		{
			name: `${STORE_KEY}editor`,
		}
	)
);
