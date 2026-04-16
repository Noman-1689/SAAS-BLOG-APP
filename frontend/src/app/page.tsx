"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (response.ok) {
          router.replace("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Home auth check failed:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkSession();
  }, [router]);

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-[#1A232E]" />;
  }

  return <LandingPage />;
}
