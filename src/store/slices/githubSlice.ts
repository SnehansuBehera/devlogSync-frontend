import { createSlice } from "@reduxjs/toolkit";
import { linkRepository } from "../thunks/githubThunks";

interface GithubState{
    loading: boolean;
    error?: string;
}

const initialState: GithubState = {
    loading: false,
    error: undefined,
}

export const githubSlice = createSlice(
    {
        name: "github",
        initialState,
        reducers: {},
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
                    state.error = action.payload as string|| "Failed to link repository";
                });
        },
    }
)