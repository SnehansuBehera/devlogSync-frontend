import { createSlice, ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { fetchProjects, fetchProjectById } from "../thunks/projectThunks";

interface MemberType {
  id: number;
  image: string | null;
  username: string;
  email: string;
}

interface OwnerType {
  id: number;
  email: string;
  username: string;
  image: string;
}

interface TaskType {
  id: number;
  title: string;
  description?: string;
  status?: string;
}

interface ProjectType {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  members: MemberType[];
  tasks?: TaskType[];
  owner: OwnerType;
}

interface ProjectState {
  loading: boolean;
  error: string | null;
  projects: ProjectType[];
  currentProject: ProjectType | null;
}

const initialState: ProjectState = {
  loading: false,
  error: null,
  projects: [],
  currentProject: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<ProjectState>) => {
    // All Projects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = (action.payload as ProjectType[]).map(project => ({
          ...project,
          owner: project.owner ?? { id: 0, email: '', username: '', image: '' }
        }));
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Single Project
    builder
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentProject = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentProject = null;
      });
  },
});

export default projectSlice.reducer;
