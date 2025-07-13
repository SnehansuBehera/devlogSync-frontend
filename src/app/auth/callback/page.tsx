"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Loader from "@/app/components/Loader";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.user) {
        router.push("/login");
        console.log("Not got");
        return;
      }

      const { email, id } = session.user;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/auth/social`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            provider: "google",
            providerAccountId: id,
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
            expiresAt: session.expires_at,
            image: session.user.user_metadata?.avatar_url,
            name: session.user.user_metadata?.full_name,
          }),
          credentials: "include",
        }
      );

      const result = await res.json();
      if (!res.ok) {
        console.error(result);
        return;
      }
      localStorage.setItem("accessToken", result.user.accessToken);
      router.push("/dashboard");
    })();
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <Loader />
    </div>
  );
}
