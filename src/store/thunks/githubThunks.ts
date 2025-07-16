import { createAsyncThunk} from "@reduxjs/toolkit";

export const linkRepository = createAsyncThunk(
    "github/linkRepository",
    async ({ repoUrl, repoName, projectId }: { repoUrl: string; repoName: string; projectId: string }, { rejectWithValue }) => {
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
                return rejectWithValue(errorData.error || "Failed to link repository");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error linking repository:", error);
            return rejectWithValue("Network or server error");
        }
    }
)