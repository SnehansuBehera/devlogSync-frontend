import { fetchProjects } from "../thunks/projectThunks";
import { createSlice, ActionReducerMapBuilder } from "@reduxjs/toolkit";


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

interface ProjectState {
  loading: boolean;
  error: string | null;
  projects: ProjectType[];
}

const initialState: ProjectState = {
  loading: false,
  error: null,
  projects: [],
};


const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {},
    extraReducers: (builder: ActionReducerMapBuilder<ProjectState>) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },

});
export default projectSlice.reducer;