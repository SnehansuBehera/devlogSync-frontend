import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AuthThunkArgs, User } from "@/types/user";
import axios from "axios";

// login/register
export const authUser = createAsyncThunk<User, AuthThunkArgs>(
  "user/authUser",
  async ({ payload, isLogin }, { rejectWithValue }) => {
    const endpoint = isLogin
      ? `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/auth/login`
      : `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/auth/register`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();
      console.log("Login res status:", res.status);
      console.log("Login response JSON:", data);

      if (!res.ok) return rejectWithValue(data.message || "Auth failed");

      return data.user as User;
    } catch (err: unknown) {
        if (err instanceof Error) {
        console.error("Auth error:", err.message);
      }
    return rejectWithValue("Network or server error");
}
  }
);

//forgot-password
export const sendForgotPasswordOtp = createAsyncThunk<
  string, // Return type
  string, // email as argument
  { rejectValue: string }
>("user/sendForgotPasswordOtp", async (email, { rejectWithValue }) => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/auth/forgot-password`, {
      email,
    });
    return email;
  } catch (err: unknown) {
        if (err instanceof Error) {
        console.error("Forgot password error:", err.message);
    }
    return rejectWithValue("Network or server error");
  }
});

export const verifyOtp = createAsyncThunk<
  void,
  { email: string; code: string },
  { rejectValue: string }
>("user/verifyOtp", async ({ email, code }, thunkAPI) => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/verify/passwordOtp`, {
      email,
      code,
    });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Invalid OTP");
    }
    return thunkAPI.rejectWithValue("Something went wrong");
  }
});

export const resendOtp = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("user/resendOtp", async (email, thunkAPI) => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/auth/forgot-password`, { email });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error resending OTP");
    }
    return thunkAPI.rejectWithValue("Something went wrong");
  }
});

export const resetPassword = createAsyncThunk<
  string, // return type
  { email: string; newPassword: string }, // args type
  { rejectValue: string } // error type
>("auth/resetPassword", async ({ email, newPassword }, { rejectWithValue }) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/auth/reset-password`,
      {
        email,
        newPassword,
      }
    );
    return response.data.message;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message || "Error resetting password");
    }
    return rejectWithValue("Error resetting password");
  }
});