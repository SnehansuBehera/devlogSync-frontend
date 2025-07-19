import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { linkRepository, fetchProjectCommits, fetchUnexportedLogs } from "../thunks/githubThunks";

interface Commit {
  id: number;
  message: string;
  time: string;
}
interface unexportedLogs{
  id: number;
  date: string;
}
interface GithubState {
  loading: boolean;
  error?: string;
  commits: Commit[];
  logs?: unexportedLogs[];
}

const initialState: GithubState = {
  loading: false,
  error: undefined,
  commits: [],
  logs: []
};

export const githubSlice = createSlice({
  name: "github",
  initialState,
  reducers: {
    clearCommits(state) {
      state.commits = [];
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(linkRepository.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(linkRepository.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(linkRepository.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to link repository";
      })

      .addCase(fetchProjectCommits.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchProjectCommits.fulfilled, (state, action: PayloadAction<Commit[]>) => {
        state.loading = false;
        state.commits = action.payload;
      })
      .addCase(fetchProjectCommits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to fetch commits";
      })
      .addCase(fetchUnexportedLogs.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
    .addCase(fetchUnexportedLogs.fulfilled, (state, action: PayloadAction<unexportedLogs[]>) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchUnexportedLogs.rejected, (state, action) => {   
        state.loading = false;
        state.error = action.payload as string || "Failed to fetch unexported logs";
      });
  },
});

export const { clearCommits } = githubSlice.actions;
export default githubSlice.reducer;
