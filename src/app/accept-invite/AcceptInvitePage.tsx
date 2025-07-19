"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AcceptInvitePage() {
  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/accept-invite?token=${token}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then(() => {
        toast.success("You’ve been added to the project!");
        router.push("/dashboard");
      })
      .catch(() => {
        toast.error("Invalid or expired invite");
      });
  }, [token, router]);

  return <p className="text-center mt-10">Processing your invitation...</p>;
}
