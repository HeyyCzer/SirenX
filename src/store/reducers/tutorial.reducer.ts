import { createSlice } from "@reduxjs/toolkit";

interface TutorialState {
	[key: string]: boolean;
}

const initialState: TutorialState = {};

const tutorial = createSlice({
	name: "tutorial",
	initialState,
	reducers: {
		setStatus: (state, { payload: { key, value } }) => {
			state[key] = value;
			return state;
		},
	},
});

export const { setStatus } = tutorial.actions;

export default tutorial.reducer;
