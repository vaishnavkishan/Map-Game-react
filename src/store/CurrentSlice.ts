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
  },
});

export const { selectCountry } = currentSlice.actions;

export default currentSlice.reducer;
