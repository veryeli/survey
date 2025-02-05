"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Wait until session is loaded

    if (session) {
      router.push("/dashboard"); // Redirect to dashboard if logged in
    } else {
      router.push("/about"); // Redirect to about page if not logged in
    }
  }, [session, status, router]);

  return <LoadingSpinner />;
}
