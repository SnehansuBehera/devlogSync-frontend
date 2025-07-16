import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import { githubSlice } from "./slices/githubSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    github: githubSlice.reducer,
    // add more reducers here
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
