import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTotalCommits = createAsyncThunk(
  "stats/fetchTotalCommits",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/user/totalCommits`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return res.data.totalCommits;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.error || "Something went wrong");
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

export const fetchTodayCommits = createAsyncThunk(
  "stats/fetchTodayCommits",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/user/day/totalCommits`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return res.data.totalCommits;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.error || "Something went wrong");
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

export const fetchWorkingDays = createAsyncThunk(
  "stats/fetchWorkingDays",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/user/workingDays`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return res.data.totalWorkingDays;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.error || "Something went wrong");
      }
      return rejectWithValue("Something went wrong");
    }
  }
);
