"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  interface Survey {
    id: string;
    season: string;
    year: number;
    pages: { id: string; title: string }[];
  }

  const [siteSurvey, setSiteSurvey] = useState<{ survey: Survey } | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/site-survey")
        .then((res) => res.json())
        .then((data) => setSiteSurvey(data))
        .catch((err) => console.error("Failed to load site survey:", err));
    }
  }, [status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div>
      {siteSurvey ? (
        <>
          <h1>{siteSurvey.survey.season} {siteSurvey.survey.year} Survey</h1>
          <ul>
            {siteSurvey.survey.pages.map((page) => (
              <li key={page.id}>
                <button onClick={() => router.push(`/survey/${siteSurvey.survey.id}/page/${page.id}`)}>
                  {page.title}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No Site Survey Found</p>
      )}
    </div>
  );
}
