import { createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";


export const fetchHeatmapData = createAsyncThunk<
  Record<string, number>,
  string, 
  { rejectValue: string }
>("heatmap/fetch", async (projectId, thunkAPI) => {
  try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/user/project/contribution?projectId=${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
    );
      const mapped = res.data.commitData;
      console.log(mapped)
    const commitMap: Record<string, number> = {};
    mapped.forEach((entry: { date: string; commitCount: number }) => {
      commitMap[entry.date] = entry.commitCount;
    });
    return commitMap;
  } catch {
    return thunkAPI.rejectWithValue("Failed to fetch heatmap data");
  }
});
export const fetchCommitsCount = createAsyncThunk(
  "commits/fetchCount",
  async (projectId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/user/project/totalCommits?projectId=${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data.totalCommitsCount;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.error || "Something went wrong");
      }
      return rejectWithValue("Something went wrong");
    }
  }
);