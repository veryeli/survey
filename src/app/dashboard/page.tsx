"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Survey {
  id: number;
  title: string;
  progress: string;  // Example: "Completed" or "Incomplete"
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch surveys from API when authenticated
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/surveys")
        .then((res) => res.json())
        .then((data) => setSurveys(data))
        .catch((err) => console.error("Failed to load surveys:", err));
    }
  }, [status]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {session?.user?.email}</h1>
      <h2 className="text-xl mb-4">Your Surveys:</h2>

      {surveys.length === 0 ? (
        <p>No surveys found.</p>
      ) : (
        <ul className="space-y-4">
          {surveys.map((survey) => (
            <li key={survey.id} className="p-4 border rounded-lg shadow-sm flex justify-between items-center">
              <span>{survey.title}</span>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-2 py-1 text-sm rounded-full ${
                    survey.progress === "Completed" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                  }`}
                >
                  {survey.progress}
                </span>
                <button
                  onClick={() => router.push(`/survey/${survey.id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  {survey.progress === "Completed" ? "View" : "Continue"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
