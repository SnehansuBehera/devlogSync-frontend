"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function ClientAuthHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const checkAuth = async () => {
      if (accessToken) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/auth/getUser`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await res.json();

        if (res.ok) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              image: data.user.image,
              username: data.user.username,
            })
          );
          if (pathname === "/login" || pathname === "/register") {
            router.replace("/dashboard");
          }
          return;
        }
      }

      if (refreshToken) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/auth/refresh-token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("accessToken", data.accessToken);

          if (pathname === "/login" || pathname === "/register") {
            router.replace("/dashboard");
          }
          return;
        }
      }

      if (
        pathname === "/dashboard" ||
        pathname === "/profile" ||
        pathname === "/profile/*"
      ) {
        router.replace("/login");
      }
    };

    checkAuth();
  }, [pathname, router]);

  return null;
}
