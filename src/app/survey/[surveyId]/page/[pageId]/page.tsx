"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar"; // Import the sidebar
import { Question } from "@/types/models";

export default function SurveyPage() {
  const { surveyId, pageId } = useParams();
  const router = useRouter();

  const [page, setPage] = useState<{ title: string; questions: Question[] } | null>(null);
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [surveyPages, setSurveyPages] = useState<{ id: number; title: string }[]>([]);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!surveyId || !pageId) return;
    fetch(`/api/survey/${surveyId}/page/${pageId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // data should include: { title, questions, responses }
        setPage(data);
        const initialResponses = data.questions.reduce(
          (acc: { [key: number]: string }, question: Question) => {
            const existing = data.responses?.find(
              (resp: { questionId: number; value: string }) => resp.questionId === question.id
            );
            acc[question.id] =
              existing && existing.value !== ""
                ? existing.value
                : question.defaultValue || "";
            return acc;
          },
          {}
        );
        setResponses(initialResponses);
      })
      .catch((err) => setError(err.message));
  }, [surveyId, pageId]);

  // Fetch survey details (pages list) for the sidebar
  useEffect(() => {
    if (!surveyId) return;
    fetch(`/api/survey/${surveyId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Assuming the API returns survey details with a pages array
        setSurveyPages(data.pages);
      })
      .catch((err) => console.error("Survey fetch error:", err));
  }, [surveyId]);

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
      router.push("/dashboard");
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!page) return <div>Loading...</div>;

  return (
    <div className="flex">
      {/* Sidebar */}
      {surveyId && pageId && (
        <Sidebar surveyId={surveyId as string} pages={surveyPages} currentPageId={pageId as string} />
      )}
      {/* Main content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {page.questions.map((question: Question) => (
            <div key={question.id}>
              <label className="block text-lg font-medium">
                {question.text}
              </label>
              <input
                type="text"
                className="mt-1 p-2 border text-gray-900 rounded w-full"
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
    </div>
  );
}
