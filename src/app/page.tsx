"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [survey, setSurvey] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/survey/3")
      .then((res) => {
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
      })
      .then((data) => setSurvey(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!survey) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">{survey.season} {survey.year} Survey</h1>
      <ul className="space-y-4">
        {survey.pages.map((page) => (
          <li key={page.id} className="p-4 border rounded-lg shadow-sm flex justify-between items-center">
            <span className="text-lg font-medium">{page.title}</span>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => router.push(`/survey/${survey.id}/page/${page.id}`)}
            >
              View
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
