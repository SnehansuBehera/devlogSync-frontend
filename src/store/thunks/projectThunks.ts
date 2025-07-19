import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ProjectType {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  members: MemberType[];
}

interface MemberType {
  image: string | null;
}

export const fetchProjects = createAsyncThunk<
    ProjectType[],
    void,
    { rejectValue: string }
>(
    "projects/fetchProjects",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/user-projects`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                credentials: "include",
            });
            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || "Failed to fetch projects");
            }
            const data = await response.json();
            return data.data as ProjectType[];
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("Unknown error");
        }
    }
);

export const createProject = createAsyncThunk<
  ProjectType,
  { name: string; description: string },
  { rejectValue: string }
>("project/createProject", async ({ name, description }, thunkAPI) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/create-project`,
      { name, description },
      { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
    );

    if (res.data.status !== 201) {
      return thunkAPI.rejectWithValue(res.data.message);
    }

    return res.data.project; 
  } catch (error: unknown) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message);
    }
    return thunkAPI.rejectWithValue("Unknown error");
  }
});

export const fetchProjectById = createAsyncThunk(
  "project/fetchDetails",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.data;
    } catch {
      return rejectWithValue("Failed to fetch project details.");
    }
  }
);