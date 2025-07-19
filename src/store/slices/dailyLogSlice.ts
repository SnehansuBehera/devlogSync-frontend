import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchHeatmapData } from "../thunks/dailyLogThunks";
import { fetchCommitsCount } from "../thunks/dailyLogThunks";

interface HeatmapState {
  commitData: Record<string, number>;
  loading: boolean;
  error: string | null;
  totalCommits: number;
  commitsCountLoading: boolean;
  commitsCountError: string | null;
}

const initialState: HeatmapState = {
  commitData: {},
  loading: false,
  error: null,
  totalCommits: 0,
  commitsCountLoading: false,
  commitsCountError: null,
};

const heatmapSlice = createSlice({
  name: "heatmap",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Heatmap data
    builder
      .addCase(fetchHeatmapData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHeatmapData.fulfilled, (state, action: PayloadAction<Record<string, number>>) => {
        state.commitData = action.payload;
        state.loading = false;
      })
      .addCase(fetchHeatmapData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      });

    // Total commits count
    builder
      .addCase(fetchCommitsCount.pending, (state) => {
        state.commitsCountLoading = true;
        state.commitsCountError = null;
      })
      .addCase(fetchCommitsCount.fulfilled, (state, action: PayloadAction<number>) => {
        state.totalCommits = action.payload;
        state.commitsCountLoading = false;
      })
      .addCase(fetchCommitsCount.rejected, (state, action) => {
        state.commitsCountLoading = false;
        state.commitsCountError = typeof action.payload === "string"
          ? action.payload
          : "Failed to fetch commit count";
      });
  },
});

export default heatmapSlice.reducer;
