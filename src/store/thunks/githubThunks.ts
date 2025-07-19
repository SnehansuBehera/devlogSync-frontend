import { createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

interface GetCommitsParams {
  projectId: string;
  date: string; // ISO date string (e.g. "2025-07-13")
}


export const fetchProjectCommits = createAsyncThunk(
  "github/fetchProjectCommits",
  async ({ projectId, date }: GetCommitsParams, thunkAPI) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/github/commits-project?projectId=${projectId}&date=${date}`,
        {
          withCredentials: true,
          headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
        }
      );
      return res.data.commits; // [{ id, message, time }]
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        return thunkAPI.rejectWithValue(err.response.data.message);
      }
      return thunkAPI.rejectWithValue("Failed to fetch commits");
    }
  }
);

export const fetchUnexportedLogs = createAsyncThunk(
  "logs/fetchUnexportedLogs",
  async (
    { projectId }: { projectId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/github/daily-logs/unexported?projectId=${projectId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data.logs;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("Failed to fetch unexported logs");
    }
  }
);

export const linkRepository = createAsyncThunk(
    "github/linkRepository",
    async ({ repoUrl, repoName, projectId }: { repoUrl: string; repoName: string; projectId: number }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/addGithub`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify({ url: repoUrl, name: repoName, projectId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || "Failed to link repository");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error linking repository:", error);
            return rejectWithValue("Network or server error");
        }
    }
)