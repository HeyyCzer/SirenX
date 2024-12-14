import DefaultCarcols from "@/default_carcols.json";
import DeltaEnum from "@/enum/direction.enum";

import { createSlice } from "@reduxjs/toolkit";

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

const initialState: EditorState = {
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
};

const editorSlice = createSlice({
	name: "editor",
	initialState,
	reducers: {
		setUploadData: (state, { payload: { id, name, file } }) => {
			state.sirenId = id;
			state.sirenName = name;
			state.uploadedFile = file;
			return state;
		},
		setCurrentBpm: (state, { payload }) => {
			state.bpm = payload;
			return state;
		},
		setSelectedColor: (state, { payload }) => {
			state.selectedColor = payload;
			return state;
		},
		updateLight: (
			state,
			{ payload: { row, column, color, isOneColorPerColumn } },
		) => {
			if (!state.lights[row]) {
				state.lights[row] = [];
			}

			if (!state.lights[row][column]) {
				state.lights[row][column] = defaultLightModel;
			}

			if (isOneColorPerColumn.value) {
				for (const row of Object.values(state.lights)) {
					if (
						row[column]?.color &&
						row[column]?.color !== color &&
						color !== "none" &&
						row[column]?.color !== "none"
					) {
						row[column].color = color;
					}
				}
			}

			const light = { ...state.lights[row][column] };
			light.color = color;
			state.lights[row][column] = light;
			return state;
		},
		updateLights: (state, { payload: lights }) => {
			state.lights = lights;
			return state;
		},
	},
});

export const {
	setUploadData,
	setCurrentBpm,
	setSelectedColor,
	updateLight,
	updateLights,
} = editorSlice.actions;

export default editorSlice.reducer;
