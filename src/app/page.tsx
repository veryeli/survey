"use client";  // This makes the component run on the client side

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      // Redirect to dashboard if logged in
      router.push("/dashboard");
    } else if (status === "unauthenticated") {
      // Redirect to login if not authenticated
      router.push("/login");
    }
  }, [status, router]);

  return <p>Loading...</p>;
}
