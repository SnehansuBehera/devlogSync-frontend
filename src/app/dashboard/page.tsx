"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      router.push("/login");
      return;
    }
    fetch("http://localhost:5000/api/auth/getUser", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(async (res) => {
        if (res.status === 401) {
          const refreshRes = await fetch(
            "http://localhost:5000/api/auth/refresh-token",
            { credentials: "include" }
          );
          const refreshData = await refreshRes.json();
          if (refreshRes.ok) {
            localStorage.setItem("accessToken", refreshData.accessToken);
            location.reload();
          } else {
            router.push("/login");
          }
        } else {
          const data = await res.json();
          setUser(data.user);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Welcome, {user?.firstName}</h1>
    </div>
  );
}
