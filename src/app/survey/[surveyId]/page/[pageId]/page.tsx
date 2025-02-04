"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Question } from "@/types/models";  // No need for SitePage here

export default function SurveyPage() {
  const { surveyId, pageId } = useParams();
  const [page, setPage] = useState<any>(null);  // Directly store the page object
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!surveyId || !pageId) return;

    fetch(`/api/survey/${surveyId}/page/${pageId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
      })
      .then((data) => setPage(data))  // Save page data directly
      .catch((err) => setError(err.message));
  }, [surveyId, pageId]);

  if (error) return <div>Error: {error}</div>;
  if (!page) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
      <form className="space-y-4">
        {page.questions.map((question: Question) => (
          <div key={question.id}>
            <label className="block text-lg font-medium">{question.text}</label>
            <input
              type="text"
              className="mt-1 p-2 border rounded w-full"
              defaultValue={question.defaultValue}
            />
          </div>
        ))}
        <div className="flex space-x-4">
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save & Confirm
          </button>
        </div>
      </form>
    </div>
  );
}
