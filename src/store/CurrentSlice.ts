import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GeoObject } from "../types";

export interface CurrentState {
  selectedCountry: GeoObject | null;
}

const initialState: CurrentState = {
  selectedCountry: null,
};

export const currentSlice = createSlice({
  name: "current",
  initialState,
  reducers: {
    selectCountry: (state, action: PayloadAction<GeoObject | null>) => {
      state.selectedCountry = action.payload;
    },
    resetCurrent: (state) => {
      state.selectedCountry = initialState.selectedCountry;
    },
  },
});

export const { selectCountry, resetCurrent } = currentSlice.actions;

export default currentSlice.reducer;
