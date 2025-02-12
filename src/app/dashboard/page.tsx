"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SiteSurvey, Survey } from "@/types/models";
import LoadingSpinner from "@/components/LoadingSpinner";
import { pages } from "next/dist/build/templates/app-page";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [siteSurvey, setSiteSurvey] = useState<SiteSurvey | null>(null);
  const [surveyDetails, setSurveyDetails] = useState<Survey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // const dashboardPage = pages.filter(page => 
  //   page.title === 'Basic' || page.title === 'Demographics'
  // )

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
    return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  //Add code to Initialize survey status

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center bg-gray-100 p-10 ">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">
       DASHBOARD
      </h1>
      <hr className="border-t-2 border-black w-full mx-auto my-6" />
      <p className="text-lg text-blue-900 my-8">Choose a category to fill up.</p>
      <div className="flex grid grid-cols-1 md:grid-cols-2 gap-6 ">

          {siteSurvey.survey.pages.slice(0,2).map((page) => (
            <div
              key={page.id}
              className="bg-gray-300 flex flex-col px-8 py-4 border rounded-lg shadow-sm flex justify-between items-center"
            >
              <span className="text-xl font-medium text-blue-900">{page.title}</span>
              <button
                className="bg-blue-500 text-white px-4 p-2 mt-8 rounded hover:bg-blue-600 text-md"
                onClick={() =>
                  router.push(`/survey/${siteSurvey.survey.id}/page/${page.id}`)
                }
              >
                Start
              </button>
            </div>
          ))}
         
      </div>
    </div>
  );
}
