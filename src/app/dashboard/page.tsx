"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [survey, setSurvey] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/survey/1")  // Replace '1' with dynamic surveyId
      .then((res) => res.json())
      .then((data) => setSurvey(data));
  }, []);

  if (!survey) return <div>Loading...</div>;

  return (
    <div>
      <h1>{survey.season} {survey.year} Survey</h1>
      <ul>
        {survey.pages.map((page) => (
          <li key={page.id}>
            <button onClick={() => router.push(`/survey/${survey.id}/page/${page.id}`)}>
              {page.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
