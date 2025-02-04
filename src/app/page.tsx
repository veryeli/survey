"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Wait until session is loaded

    if (session) {
      router.push("/dashboard"); // Redirect to dashboard if logged in
    } else {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [session, status, router]);

  return <div>Loading...</div>; // Fallback while checking session
}
