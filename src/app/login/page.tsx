"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import { useAppDispatch } from "@/store/hooks";
import { authUser } from "@/store/thunks/userThunks";

export default function SignupPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();

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

    const payload = isLogin
      ? { email, password }
      : { email, password, firstName, lastName, username };

    try {
      const resultAction = await dispatch(authUser({ payload, isLogin }));

      if (authUser.rejected.match(resultAction)) {
        toast.error(resultAction.payload as string);
        return;
      }

      toast.success(isLogin ? "Login successful" : "Account created");
      router.push("/dashboard");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
      setUsername("");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-10 sm:px-14 sm:py-16 md:px-24 lg:px-14 lg:py-12 ">
        <div className="mb-5 md:mb-8">
          <Image
            src="/logo-nav.png"
            alt="Logo"
            width={100}
            height={100}
            className="w-10 h-10"
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
              src="/google.png"
              alt="Google"
              width={50}
              height={50}
              className="w-5 h-5"
            />
          </button>
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-sm mb-3 md:mb-2">
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
          {isLogin && (
            <p
              onClick={() => router.push("/forgotPassword")}
              className="text-blue-600 text-sm text-right cursor-pointer"
            >
              <span className="text-red-400">*</span> Forgot password
            </p>
          )}
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
              “DevLogSync makes it effortless to keep track of my daily
              development work. Everything I’ve done all synced and summarized
              automatically.”
            </p>
            <div className="flex items-center mt-4 gap-3 justify-center">
              <Image
                src="/logo-nav.png"
                className="w-10 h-10 rounded-full"
                alt="avatar"
                width={50}
                height={50}
              />
              <div
                onClick={() => router.push("https://github.com/SnehansuBehera")}
                className="text-left cursor-pointer"
              >
                <p className="font-medium">Snehansu Behera</p>
                <p className="text-sm text-white/70">FullStack Developer</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
            <p className="text-sm font-semibold tracking-wider">GROWTH</p>
            <p className="text-2xl font-bold mt-1">+21.35%</p>
            <p className="text-sm text-white/70">
              Productivity boost last month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
