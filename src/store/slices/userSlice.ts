import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authUser, sendForgotPasswordOtp, resendOtp, verifyOtp, resetPassword } from "../thunks/userThunks";
import type { User } from "@/types/user";

export interface UserState extends User {
  loading: boolean;
  error?: string;
  forgotPasswordEmail: string | null;
  resetSuccess: string | null;
  refreshToken?: string;

}

const initialState: UserState = {
  id: 0,
  email: "",
  firstName: "",
  lastName: "",
  username: "",
  image: "",
  accessToken: "",
  refreshToken: "",
  githubToken: "",
  githubUsername: "",
  password: "",
  loading: false,
  error: undefined,
  forgotPasswordEmail: null,
    resetSuccess: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
      return { ...initialState };
    },
    setForgotPasswordEmail(state, action: PayloadAction<string>) {
      state.forgotPasswordEmail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(authUser.fulfilled, (state, action: PayloadAction<User>) => {
        Object.assign(state, action.payload);
        state.loading = false;
        state.error = undefined;
      })
      .addCase(authUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendForgotPasswordOtp.fulfilled, (state, action) => {
        state.forgotPasswordEmail = action.payload;
      }).addCase(resendOtp.fulfilled, (state, action) => {
        console.log(state, action);
      }).addCase(resendOtp.rejected, (state, action) => {
        state.error = action.payload;
      }).addCase(verifyOtp.rejected, (state, action) => {
          state.error = action.payload;
      }).addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.resetSuccess = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.resetSuccess = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });

  },
});

export const { clearUser, setForgotPasswordEmail } = userSlice.actions;
export default userSlice.reducer;
