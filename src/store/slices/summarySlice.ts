import { createSlice } from "@reduxjs/toolkit";
import { generateSummaryAndSendEmail } from "../thunks/summaryThunks";

interface SummaryState {
  loading: boolean;
  error: string | null;
}

const initialState: SummaryState = {
  loading: false,
  error: null,
};

const summarySlice = createSlice({
  name: "summary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateSummaryAndSendEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateSummaryAndSendEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(generateSummaryAndSendEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error generating summary";
      });
  },
});

export default summarySlice.reducer;
