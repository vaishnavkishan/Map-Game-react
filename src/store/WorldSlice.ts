import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Guess } from "../types";

export interface WorldChallengeState {
  selectedCountries: Guess[];
}

const initialState: WorldChallengeState = {
  selectedCountries: [],
};

export const worldSlice = createSlice({
  name: "world-challenge",
  initialState,
  reducers: {
    selectCountry: (state, action: PayloadAction<Guess>) => {
      state.selectedCountries = [action.payload, ...state.selectedCountries];
    },
    resetWorld: (state) => {
      state.selectedCountries = initialState.selectedCountries;
    },
  },
});

export const { selectCountry, resetWorld } = worldSlice.actions;

export default worldSlice.reducer;
