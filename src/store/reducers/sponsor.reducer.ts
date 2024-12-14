import { createSlice } from "@reduxjs/toolkit";

interface SponsorState {
	lastSeen?: number;
}

const initialState: SponsorState = {};

const sponsor = createSlice({
	name: "sponsor",
	initialState,
	reducers: {
		setSponsorLastSeen: (state, { payload: value }) => {
			state.lastSeen = value;
			return state;
		},
	},
});

export const { setSponsorLastSeen } = sponsor.actions;

export default sponsor.reducer;
