import { configureStore } from "@reduxjs/toolkit";
import worldChallengeReducer from "./WorldSlice";
import currentReducer from "./CurrentSlice";

export const store = configureStore({
  reducer: {
    worldChallenge: worldChallengeReducer,
    current: currentReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const selectedCountries = (state: RootState) => state.worldChallenge;
export const current = (state: RootState) => state.current;
