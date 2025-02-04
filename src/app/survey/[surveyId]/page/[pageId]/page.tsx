"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Question } from "@/types/models";

export default function SurveyPage() {
  const { surveyId, pageId } = useParams();
  const [page, setPage] = useState<{ title: string; questions: Question[] } | null>(null);
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!surveyId || !pageId) return;

    fetch(`/api/survey/${surveyId}/page/${pageId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setPage(data);
        const initialResponses = data.questions.reduce((acc: { [key: number]: string }, question: Question) => {
          acc[question.id] = question.defaultValue || "";
          return acc;
        }, {});
        setResponses(initialResponses);
      })
      .catch((err) => setError(err.message));
  }, [surveyId, pageId]);

  const handleInputChange = (questionId: number, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (confirm = false) => {
    const payload = {
      surveyId,
      pageId,
      responses: Object.entries(responses).map(([questionId, value]) => ({
        questionId: parseInt(questionId),
        value,
      })),
      confirmed: confirm,
    };

    const res = await fetch(`/api/survey/${surveyId}/page/${pageId}/response`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error Response:", errorData);
      setError(errorData.error || "Failed to save responses.");
    } else {
      alert(confirm ? "Responses saved and confirmed!" : "Responses saved!");
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!page) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {page.questions.map((question: Question) => (
          <div key={question.id}>
            <label className="block text-lg font-medium">{question.text}</label>
            <input
              type="text"
              className="mt-1 p-2 border rounded w-full"
              value={responses[question.id]}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
            />
          </div>
        ))}
        <div className="flex space-x-4">
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => handleSubmit(false)}
          >
            Save
          </button>
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => handleSubmit(true)}
          >
            Save & Confirm
          </button>
        </div>
      </form>
    </div>
  );
}
