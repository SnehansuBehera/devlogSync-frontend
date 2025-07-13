"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split("; ");
      const tokenCookie = cookies.find((row) => row.startsWith("accessToken="));
      const token = tokenCookie ? tokenCookie.split("=")[1] : null;
      setAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  return (
    <div className="bg-zinc-100 w-full sm:w-[94.6%] mx-auto h-[82vh] px-5 py-4 sm:px-10 sm:py-6">
      <section className="relative overflow-hidden rounded-2xl ring-1 ring-gray-400 h-[82vh]">
        <div className="absolute inset-0 bg-[url('/dots.png')] opacity-15 z-0 w-full" />

        <div className="absolute top-3 sm:top-10 left-0 rotate-[-5deg]">
          <Image
            src="/vscode.png"
            alt="vscode"
            width={150}
            height={150}
            className="w-24 sm:w-[15vw]"
            loading="lazy"
          />
        </div>
        <div className="absolute top-8 right-5 sm:right-0 rotate-[8deg]">
          <Image
            src="/remainder-card.png"
            alt="Reminder Card"
            width={180}
            height={180}
            className="w-24 sm:w-[15vw]"
            loading="lazy"
          />
        </div>
        <div className="absolute bottom-0 left-0 rotate-[-3deg]">
          <Image
            src="/task-card.png"
            alt="Today's Tasks"
            width={180}
            height={180}
            className="w-24 sm:w-[15vw]"
            loading="lazy"
          />
        </div>
        <div className="absolute bottom-14 right-5 sm:bottom-1 sm:right-0 rotate-[5deg]">
          <Image
            src="/github-card.png"
            alt="Integrations"
            width={200}
            height={200}
            className="w-40 sm:w-[15vw]"
            loading="lazy"
          />
        </div>

        <div className="flex flex-col items-start sm:items-center justify-center z-20 h-full w-[80%] sm:w-[60%] mx-auto sm:gap-1">
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={150}
            className="absolute top-18 sm:top-8 w-[8rem] sm:w-[15rem]"
          />

          <h2 className="text-[9.5vw] sm:text-4xl md:text-6xl font-bold leading-8 sm:leading-none">
            Think, plan, and track
          </h2>
          <p className="text-xl md:text-5xl text-gray-400 mt-2 font-medium">
            all in one place
          </p>
          <p className="mt-2 text-gray-600 text-sm md:text-base">
            Efficiently manage your tasks and boost productivity.
          </p>
          <div className="mt-4 sm:mt-6 text-sm font-sans z-10">
            <Button
              className="cursor-pointer"
              onClick={() =>
                router.push(authenticated ? "/dashboard" : "/login")
              }
              size="lg"
            >
              {authenticated ? "Dashboard" : "Login"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
