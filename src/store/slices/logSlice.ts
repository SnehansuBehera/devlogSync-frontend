import { createSlice } from "@reduxjs/toolkit";
import { fetchTotalCommits, fetchTodayCommits, fetchWorkingDays } from "../thunks/logThunks";

interface StatsState {
  totalCommits: number;
  todayCommits: number;
  workingDays: number;
  loading: boolean;
  error: string | null;
}

const initialState: StatsState = {
  totalCommits: 0,
  todayCommits: 0,
  workingDays: 0,
  loading: false,
  error: null,
};

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Total Commits
      .addCase(fetchTotalCommits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalCommits.fulfilled, (state, action) => {
        state.totalCommits = action.payload;
        state.loading = false;
      })
      .addCase(fetchTotalCommits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Today Commits
      .addCase(fetchTodayCommits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayCommits.fulfilled, (state, action) => {
        state.todayCommits = action.payload;
        state.loading = false;
      })
      .addCase(fetchTodayCommits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Working Days
      .addCase(fetchWorkingDays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkingDays.fulfilled, (state, action) => {
        state.workingDays = action.payload;
        state.loading = false;
      })
      .addCase(fetchWorkingDays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default statsSlice.reducer;
