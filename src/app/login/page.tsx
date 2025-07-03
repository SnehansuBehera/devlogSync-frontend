"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    console.log(data);
    if (error) toast.error("Google sign-in failed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = isLogin
        ? { email, password }
        : { firstName, lastName, email, password, username };

      const endpoint = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
      setUsername("");
      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
      } else {
        toast.success(data.message);
        localStorage.setItem("accessToken", data.user.accessToken);
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Network error or server unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-10 sm:px-14 sm:py-16 md:px-24 lg:px-14 lg:py-12 ">
        <div className="mb-5 md:mb-8">
          <Image
            src="/next.svg"
            alt="Logo"
            width={100}
            height={24}
            className=" mb-3 md:mb-4"
          />
          <h1 className="text-2xl sm:text-3xl font-semibold">
            {isLogin ? "Login to your account" : "Create a new account"}
          </h1>
          <p className="text-gray-500 mt-2">
            {isLogin
              ? "Welcome back! Please login."
              : "Start your day by creating an account."}
          </p>
        </div>
        <div className="flex items-center justify-between space-x-2">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 border w-full py-2 rounded-md text-sm font-medium mb-3 md:mb-2 lg:mb-5"
          >
            <Image
              src="/next.svg"
              alt="Google"
              width={50}
              height={50}
              className="w-10 h-5"
            />
          </button>
          <button className="flex items-center justify-center gap-2 border w-full py-2 rounded-md text-sm font-medium mb-3 md:mb-2 lg:mb-5">
            <Image
              src="/next.svg"
              alt="Google"
              width={50}
              height={50}
              className="w-10 h-5"
            />
          </button>
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-sm mb-3 md:mb-2 lg:mb-4">
          <div className="h-px bg-gray-200 flex-1" />
          or
          <div className="h-px bg-gray-200 flex-1" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-2">
          {!isLogin && (
            <div className="flex items-center justify-between space-x-2">
              <div className="w-full">
                <label className="text-sm font-medium">
                  First Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="text-sm w-full border rounded-md px-2 py-2 mt-1"
                  required
                />
              </div>
              <div className="w-full">
                <label className="text-sm font-medium">
                  Last Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className="text-sm w-full border rounded-md px-2 py-2 mt-1"
                  required
                />
              </div>
            </div>
          )}
          {!isLogin && (
            <div>
              <label className="text-sm font-medium">
                Username<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="text-sm w-full border rounded-md px-2 py-2 mt-1"
                required
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="text-sm w-full border rounded-md px-2 py-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              Password<span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="text-sm w-full border rounded-md px-2 py-2 mt-1"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white w-full py-2 rounded-md mt-2 hover:opacity-90 transition"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-black font-medium underline"
              >
                Register here
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-black font-medium underline"
              >
                Login here
              </button>
            </>
          )}
        </p>
      </div>

      {/* Right Side Branding */}
      <div className="bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300 p-12 flex flex-col justify-center text-center text-white">
        <div className="max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl mb-6">
            <p className="text-xl font-medium">
              “Basement is surprisingly handy for keeping all my business stuff
              in one place.”
            </p>
            <div className="flex items-center mt-4 gap-3 justify-center">
              <Image
                src="/vercel.svg"
                className="w-10 h-10 rounded-full border"
                alt="avatar"
                width={50}
                height={50}
              />
              <div className="text-left">
                <p className="font-medium">David Miller</p>
                <p className="text-sm text-white/70">E-commerce Specialist</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
            <p className="text-sm font-semibold tracking-wider">GROWTH</p>
            <p className="text-2xl font-bold mt-1">+21.35%</p>
            <p className="text-sm text-white/70">last month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
