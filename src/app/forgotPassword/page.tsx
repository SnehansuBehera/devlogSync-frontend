"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/store/hooks";
import { sendForgotPasswordOtp } from "@/store/thunks/userThunks";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSendOtp = async () => {
    if (!email) return toast.error("Email is required");

    const result = await dispatch(sendForgotPasswordOtp(email));

    if (sendForgotPasswordOtp.fulfilled.match(result)) {
      toast.success("OTP sent to email");
      router.push("/verifyOtp");
    } else {
      toast.error(result.payload || "Failed to send OTP");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleSendOtp}
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        Send OTP
      </button>
    </div>
  );
}
