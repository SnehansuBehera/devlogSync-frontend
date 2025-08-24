"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import axios from "axios";
import { Pencil } from "lucide-react";
import { FaArrowRight } from "react-icons/fa6";
import { RxGithubLogo } from "react-icons/rx";
import { MdEmail } from "react-icons/md";
import { FaAt } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import Logs from "./Logs";
const tabs = ["Profile", "Logs", "Password"];
interface UserData {
  user: {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
    image: string | null;
    isActive: boolean;
    isAdmin: boolean;
    isVerified: boolean;
    createdAt: string;
    accessToken: string;
    githubToken: string | null;
    githubUsername: string | null;
  };
}
export default function ProfileDashboard() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [data, setData] = useState<UserData | null>(null);
  const [firstName, setfirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const cloudinaryUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_UPLOADPRESET || ""
    );
    formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDNAME || "");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDNAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };
  const connectToGithub = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }
    const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=repo,admin:repo_hook,user:email&state=${token}`;

    window.location.href = githubAuthURL;
  };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await cloudinaryUpload(file);
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/auth/update-user`,
        { image: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Profile picture updated");
      setData((prev) =>
        prev
          ? {
              ...prev,
              user: {
                ...prev.user,
                image: imageUrl,
              },
            }
          : prev
      );
    } catch (error) {
      toast.error("Failed to update profile picture");
      console.error(error);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: string
  ) => {
    if (e.key === "Enter") {
      setEditingField(null);
      await handleProfileUpdate();
      console.log(field);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/auth/update-user`,
        {
          firstName,
          lastName,
          email,
          username,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 200) {
        toast.success("Profile updated successfully");
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            user: {
              ...prev.user,
              firstName,
              lastName,
              email,
              username,
            },
          };
        });
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Update failed");
      } else {
        toast.error("Update failed");
      }
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          setData(null);
          return;
        }

        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/auth/getUser`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (userRes.ok) {
          const userData = await userRes.json();
          setData(userData);
          setfirstName(data?.user.firstName ?? "");
          setLastName(data?.user.lastName ?? "");
          setEmail(data?.user.email ?? "");
          setUsername(data?.user.username ?? "");
        } else {
          setData(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setData(null);
      }
    };

    getUser();
  }, [
    data?.user.firstName,
    data?.user.lastName,
    data?.user.email,
    data?.user.username,
    data?.user.password,
  ]);

  useEffect(() => {
    if (data?.user) {
      setfirstName(data.user.firstName ?? "");
      setLastName(data.user.lastName ?? "");
      setEmail(data.user.email ?? "");
      setUsername(data.user.username ?? "");
    }
  }, [data?.user]);
  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/auth/change-password`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.data;
      console.log(data);
      if (res.status === 200) {
        toast.success("Password updated successfully!");
        setForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error updating password:", err);
      toast.error("Error updating password");
    }
  };
  const handlePasswordSet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/auth/set-password`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.data;
      if (res.status === 200) {
        toast.success("Password set successfully!");
        setForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error setting password:", err);
      toast.error("Error setting password");
    }
  };

  return (
    <div className="w-[88%] sm:w-[90%] mx-auto mt-4 sm:px-5 py-4 bg-[#f5f6ff] flex flex-col rounded-2xl">
      <div className="h-40 w-full bg-gradient-to-r from-orange-100 to-yellow-200  rounded-2xl" />
      <div className="px-4 md:px-12 -mt-20">
        <div className="bg-white shadow-md md:h-[75vh] rounded-lg px-5 sm:px-10 pb-4">
          <div className="flex flex-col items-start justify-center sm:flex-row sm:justify-start sm:items-center space-x-4 -mt-8 pt-5">
            <div
              className="relative group w-16 h-16 md:w-24 md:h-24"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image
                src={data?.user?.image || "/logo-nav.png"}
                alt="avatar"
                width={96}
                height={96}
                className="w-full h-full object-cover rounded-full border-4 border-white group-hover:blur-[2px] transition-all duration-200"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-opacity-20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200">
                <Pencil className="w-5 h-5 text-white" />
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg sm:text-2xl font-semibold">
                {data?.user.username}
              </h2>
              <p className="text-sm text-gray-600 flex items-center">
                {data?.user.email}
              </p>
              <div className="flex flex-1 items-center justify-start gap-2">
                <span className="inline-block text-green-700 bg-green-100 text-xs px-2 py-1 rounded-full mt-1">
                  {data?.user.firstName} {data?.user.lastName}
                </span>
                {data?.user.isVerified ? (
                  <span className="inline-block md:hidden text-zinc-700 bg-zinc-100 text-xs px-2 py-1 rounded-full mt-1">
                    Verified
                  </span>
                ) : (
                  <span className="inline-block md:hidden text-red-700 bg-red-100 text-xs px-2 py-1 rounded-full mt-1">
                    Not Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-2 border-b border-gray-200">
            <div className="flex space-x-10 md:space-x-6 text-xs sm:space-x-6 sm:text-sm">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className={cn(
                    "py-2 border-b-2 transition-all",
                    selectedTab === index
                      ? "border-purple-500 text-purple-700 font-medium"
                      : "border-transparent text-gray-500 hover:text-black"
                  )}
                  onClick={() => setSelectedTab(index)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          {selectedTab === 0 && data && (
            <div className="my-6 flex flex-col items-start justify-center gap-4 text-sm text-gray-700">
              <div className="flex flex-col items-start justify-center md:flex-row sm:items-center sm:justify-start gap-4 sm:gap-8">
                <div className="flex justify-start items-center gap-3 sm:gap-5">
                  <div className="flex justify-start items-center gap-2">
                    <FaUser className="hidden md:flex text-zinc-600 text-lg" />
                    <p className="font-medium text-sm">First Name</p>
                  </div>
                  <div className="relative">
                    <input
                      className="font-normal text-sm ring-1 ring-zinc-600 px-2 sm:px-4 py-2 rounded-3xl"
                      value={firstName}
                      onKeyDown={(e) => handleKeyDown(e, "firstName")}
                      readOnly={editingField !== "firstName"}
                      onChange={(e) => setfirstName(e.target.value)}
                    />
                    <Pencil
                      className="absolute top-2.5 right-2 w-4 h-4 text-gray-600 cursor-pointer"
                      onClick={() => setEditingField("firstName")}
                    />
                  </div>
                </div>
                <div className="flex justify-start items-center gap-3 sm:gap-5">
                  <p className="font-medium text-sm">Last Name</p>
                  <div className="relative">
                    <input
                      className="font-normal text-sm ring-1 ring-zinc-600 px-2 sm:px-4 py-2 rounded-3xl"
                      value={lastName}
                      onKeyDown={(e) => handleKeyDown(e, "lastName")}
                      readOnly={editingField !== "lastName"}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    <Pencil
                      className="absolute top-2.5 right-2 w-4 h-4 text-gray-600 cursor-pointer"
                      onClick={() => setEditingField("lastName")}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-start items-center gap-3 sm:gap-5">
                <div className="flex justify-start items-center gap-2">
                  <MdEmail className="hidden md:flex text-zinc-600 text-lg" />
                  <p className="font-medium text-sm">Email</p>
                </div>
                <div className="relative">
                  <input
                    className="font-normal w-full sm:w-72 text-sm ring-1 ring-zinc-600 px-2 sm:px-4 py-2 rounded-3xl"
                    value={email}
                    readOnly={editingField !== "email"}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "email")}
                  />
                  <Pencil
                    className="absolute top-2.5 right-2 w-4 h-4 text-gray-600 cursor-pointer"
                    onClick={() => setEditingField("email")}
                  />
                </div>
              </div>

              <div className="flex justify-start items-center gap-3 sm:gap-5">
                <div className="flex justify-start items-center gap-2">
                  <FaAt className="hidden md:flex text-zinc-600 text-lg" />
                  <p className="font-medium text-sm">Username</p>
                </div>

                <div className="relative">
                  <input
                    className="font-normal text-sm ring-1 ring-zinc-600 px-2 sm:px-4 py-2 rounded-3xl"
                    value={username}
                    readOnly={editingField !== "username"}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "username")}
                  />
                  <Pencil
                    className="absolute top-2.5 right-2 w-4 h-4 text-gray-600 cursor-pointer"
                    onClick={() => setEditingField("username")}
                  />
                </div>
              </div>
              <div className="hidden md:flex justify-start items-center gap-5 w-32">
                <div className="flex justify-start items-center gap-2">
                  <MdVerifiedUser className="hidden md:flex text-zinc-600 text-lg" />
                  <p className="font-medium text-sm">Verified</p>
                </div>
                {data.user.isVerified ? (
                  <p className=" px-4 py-1 rounded-2xl text-green-700 font-medium bg-green-100">
                    Yes
                  </p>
                ) : (
                  <p className="px-4 py-1 rounded-2xl text-red-700 bg-red-100">
                    No
                  </p>
                )}
              </div>
              {data.user.githubUsername ? (
                <div className="flex justify-start items-center gap-5">
                  <div className="flex items-center justify-start gap-2">
                    <RxGithubLogo className="hidden md:flex text-zinc-600 text-lg" />
                    <p className="font-medium">GitHub</p>
                  </div>
                  <p className="bg-gray-200 px-4 py-2 rounded-lg text-sm  font-medium">
                    {data.user.githubUsername}
                  </p>
                </div>
              ) : (
                <button
                  className="px-5 py-2 gap-2 rounded-2xl bg-blue-400 flex items-center justify-start"
                  onClick={connectToGithub}
                >
                  <RxGithubLogo className="text-white" />
                  <p className="text-sm text-white">Github</p>
                  <FaArrowRight className="text-white" />
                </button>
              )}
            </div>
          )}
          {selectedTab === 1 && <Logs />}
          {selectedTab === 2 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">
                {data?.user.password ? "Reset Password" : "Set Password"}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Here you can change the password to your account.
              </p>
              <form
                onSubmit={(e) => {
                  if (data?.user.password) {
                    handlePasswordChange(e);
                  } else {
                    handlePasswordSet(e);
                  }
                }}
                className="space-y-2"
              >
                {data?.user.password && (
                  <div>
                    <label className="text-sm text-gray-700 mb-1 block">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={form.currentPassword}
                      onChange={handleChange}
                      className="w-full sm:w-2xs text-sm border rounded-md px-2 py-2 mt-1"
                    />
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">
                    {data?.user.password ? "New Password" : "Password"}
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    className="w-full sm:w-2xs text-sm border rounded-md px-2 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full sm:w-2xs text-sm border rounded-md px-2 py-2 mt-1"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <Button type="button">Cancel</Button>
                  <Button type="submit">Update Password</Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
