"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SiteSurvey, Survey } from "@/types/models";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [siteSurvey, setSiteSurvey] = useState<SiteSurvey | null>(null);
  const [surveyDetails, setSurveyDetails] = useState<Survey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Wait until session is loaded

    if (!session) {
      router.push("/about");
      return;
    }

    fetch("/api/site-survey")
      .then((res) => {
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Full API response:", data);
        const ss: SiteSurvey = data.siteSurvey;
        setSiteSurvey(ss);
        return fetch(`/api/survey/${ss.surveyId}`);
      })
      .then((res) => {
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
      })
      .then((survey: Survey) => setSurveyDetails(survey))
      .catch((err) => setError(err.message));
  }, [session, status, router]);

  if (status === "loading" || !siteSurvey || !surveyDetails)
    return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        {siteSurvey.survey.season} {siteSurvey.survey.year} Survey Dashboard
      </h1>
      <ul className="space-y-4">
        {siteSurvey.survey.pages.map((page) => (
          <li
            key={page.id}
            className="p-4 border rounded-lg shadow-sm flex justify-between items-center"
          >
            <span className="text-lg font-medium">{page.title}</span>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() =>
                router.push(`/survey/${siteSurvey.survey.id}/page/${page.id}`)
              }
            >
              View
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
