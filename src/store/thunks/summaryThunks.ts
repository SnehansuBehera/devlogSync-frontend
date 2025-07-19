import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface SummaryResponse {
  summary: string;
  export: string;
}

export const generateSummaryAndSendEmail = createAsyncThunk<
  SummaryResponse,
  { projectId: string },
  { rejectValue: string }
>("summary/generateAndEmail", async ({ projectId }, thunkAPI) => {
  try {
    const summaryRes = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/user/aiSummary?projectId=${projectId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    if (!summaryRes?.data?.export) {
      return thunkAPI.rejectWithValue("PDF not generated during summary creation.");
    }

    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/summary/send-report/${projectId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    return summaryRes.data;
  } catch (error: unknown) {
    console.error("Error in generateSummaryAndSendEmail thunk:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
    return thunkAPI.rejectWithValue("Failed to export and send email");
  }
});
