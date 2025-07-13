"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetPassword } from "@/store/thunks/userThunks";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, forgotPasswordEmail } = useAppSelector(
    (state) => state.user
  );
  const email = forgotPasswordEmail || "";

  const handleReset = async () => {
    if (!password) return toast.error("New password is required");

    const result = await dispatch(
      resetPassword({ email, newPassword: password })
    );

    if (resetPassword.fulfilled.match(result)) {
      toast.success("Password reset successful");
      router.push("/login");
    } else {
      toast.error(result.payload || "Error resetting password");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleReset}
        className="w-full bg-purple-600 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </div>
  );
}
