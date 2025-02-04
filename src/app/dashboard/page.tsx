"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [sites, setSites] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/site-surveys")
      .then((res) => res.json())
      .then((data) => setSites(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!sites.length) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Your Site Surveys</h1>
      <ul className="space-y-4">
        {sites.map((site) => (
          <li key={site.id} className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-xl font-medium">{site.address}</h2>
            {site.siteSurveys.map((survey) => (
              <div key={survey.id}>
                <p className="mt-2">{survey.survey.season} {survey.survey.year} Survey</p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                  onClick={() => router.push(`/survey/${survey.survey.id}`)}
                >
                  View Survey
                </button>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
