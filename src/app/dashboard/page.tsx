"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Page {
  id: number;
  title: string;
  completed: boolean;
}

interface Survey {
  id: number;
  title: string;
  year: number;
  season: string;
  pages?: Page[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [survey, setSurvey] = useState<Survey | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/surveys")
        .then((res) => res.json())
        .then((data) => setSurvey(data[0]))  // Load the most recent survey
        .catch((err) => console.error("Failed to load survey:", err));
    }
  }, [status]);

  if (status === "loading" || !survey) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {session?.user?.email}</h1>
      <h2 className="text-xl mb-4">{survey.title}</h2>

      <ul className="space-y-2">
        {survey.pages?.map((page) => (
          <li key={page.id} className="flex justify-between items-center p-4 border rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
              <span
                className={`h-4 w-4 rounded-full ${
                  page.completed ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              <span>{page.title}</span>
            </div>
            <button
              onClick={() => router.push(`/survey/${survey.id}/page/${page.id}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              {page.completed ? "View" : "Continue"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
