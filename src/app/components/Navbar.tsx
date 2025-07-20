"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface UserData {
  user: {
    image: string;
  };
}

const Navbar = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<UserData | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (res.ok) {
        toast.success("Logout successfull");
        setAuthenticated(false);
        setData(null);
        router.push("/");
        localStorage.setItem("accessToken", "");
        localStorage.setItem("refreshToken", "");
        localStorage.setItem("user", "");
      } else {
        const data = await res.json();
        console.error("Logout failed:", data);
        toast.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setAuthenticated(false);
          setData(null);
          return;
        }
        const userString = localStorage.getItem("user");
        let image, username;
        if (userString) {
          try {
            const userObj = JSON.parse(userString);
            image = userObj.image;
            username = userObj.username;
          } catch {
            image = undefined;
            username = undefined;
          }
        }
        if (image && username) {
          setAuthenticated(true);
          setData({ user: { image } });
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
          localStorage.setItem(
            "user",
            JSON.stringify({
              image: userData.user.image,
              username: userData.user.username,
            })
          );
          setAuthenticated(true);
          setData({ user: { image: userData.user.image } });
        } else {
          setAuthenticated(false);
          setData(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setAuthenticated(false);
        setData(null);
      }
    };

    getUser();
  }, [pathname]);
  if (
    pathname === "/login" ||
    pathname === "/forgotPassword" ||
    pathname === "/verifyOtp" ||
    pathname === "/resetpassword"
  ) {
    return null;
  }

  return (
    <div className="w-[88%] sm:w-[90%] mx-auto mt-4 px-2 sm:px-5 py-2 bg-zinc-100 flex items-center justify-between border rounded-2xl ">
      <div
        onClick={() => router.push("/")}
        className="flex items-center justify-center gap-2 cursor-pointer"
      >
        <Image
          src="/logo-nav.png"
          alt="logo"
          width={250}
          height={250}
          className="w-6 sm:w-8"
        />
        <p className="font-bold text-lg">DevLogSync</p>
      </div>

      <div className="flex items-center justify-start gap-8">
        <div className="hidden sm:flex items-center justify-center gap-10 text-lg  font-light">
          {pathname === "/" && (
            <>
              <a
                onClick={() => handleScroll("about")}
                className="text-gray-800 hover:text-zinc-400 cursor-pointer"
              >
                About
              </a>
              <a
                onClick={() => handleScroll("guide")}
                className="text-gray-800 hover:text-zinc-400 cursor-pointer"
              >
                Guide
              </a>
            </>
          )}
          {authenticated && (
            <a
              onClick={handleLogout}
              className="text-gray-800 hover:text-zinc-400 cursor-pointer"
            >
              Logout
            </a>
          )}
        </div>
        {authenticated && data?.user ? (
          <div>
            <Image
              src={data.user.image || "/logo-nav.png"}
              onClick={() => router.push("/profile")}
              alt="profile"
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10 cursor-pointer"
              width={150}
              height={150}
            />
          </div>
        ) : (
          <Button
            className="cursor-pointer"
            onClick={() => router.push("/login")}
            size="sm"
          >
            LOGIN
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
