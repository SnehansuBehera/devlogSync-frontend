"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { verifyOtp, resendOtp } from "@/store/thunks/userThunks";
import toast from "react-hot-toast";
import axios from "axios";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(60);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const email = useAppSelector((state) => state.user.forgotPasswordEmail);

  useEffect(() => {
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    if (!email) return toast.error("Email not found in state");
    try {
      await dispatch(verifyOtp({ email, code: otp })).unwrap();
      toast.success("OTP verified!");
      router.push("/resetpassword");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Invalid OTP");
      } else {
        toast.error("Invalid OTP");
      }
    }
  };

  const handleResend = async () => {
    if (!email) return toast.error("Email not found");
    if (cooldown > 0) return;
    try {
      await dispatch(resendOtp(email)).unwrap();
      toast.success("OTP resent to email");
      setCooldown(60);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Unable to send OTP");
      } else {
        toast.error("Unable to send OTP");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
      <input
        type="text"
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        maxLength={6}
      />
      <button
        onClick={handleVerify}
        className="w-full bg-green-600 text-white p-2 rounded mb-2"
      >
        Verify OTP
      </button>
      <button
        onClick={handleResend}
        disabled={cooldown > 0}
        className={`w-full p-2 rounded ${
          cooldown > 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 text-white"
        }`}
      >
        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
      </button>
      <p className="text-sm text-gray-500 mt-2 text-center">
        OTP is valid for 10 minutes
      </p>
    </div>
  );
}
