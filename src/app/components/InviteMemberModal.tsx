"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function InviteMemberModal({
  projectId,
}: {
  projectId: number;
}) {
  const [email, setEmail] = useState("");

  const sendInvite = async () => {
    if (!email) return toast.error("Please enter an email");
    console.log(projectId);
    try {
      await axios.post(
        "https://devlogsync.onrender.com/api/invite",
        { email, projectId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      toast.success("Invitation sent!");
      setEmail("");
    } catch {
      toast.error("Failed to send invite");
    }
  };

  return (
    <div className="p-2">
      <h2 className="text-lg font-semibold mb-2">Invite a Member</h2>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-300 p-2 rounded w-full mb-2"
      />
      <button
        onClick={sendInvite}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
      >
        Send Invitation
      </button>
    </div>
  );
}
