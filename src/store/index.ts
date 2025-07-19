import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import { githubSlice } from "./slices/githubSlice";
import summaryReducer from "./slices/summarySlice";
import projectReducer from "./slices/projectSlices";
import heatmapReducer from "./slices/dailyLogSlice";
import logReducer from "./slices/logSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    github: githubSlice.reducer,
    summary: summaryReducer,
    project: projectReducer,
    heatmap: heatmapReducer,
    stats: logReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
