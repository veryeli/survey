"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import surveys from "@/mock/surveys.json";  // Import mock data

export default function SurveyPage() {
  const router = useRouter();
  const { surveyId, pageId } = useParams<{ surveyId: string; pageId: string }>();
  const [pageData, setPageData] = useState<any>(null);

  // Load the specific page based on surveyId and pageId
  useEffect(() => {
    const survey = surveys.find((s) => s.id === parseInt(surveyId));
    const page = survey?.pages.find((p) => p.id === parseInt(pageId));
    setPageData(page);
  }, [surveyId, pageId]);

  if (!pageData) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{pageData.title}</h1>

      <form>
        {pageData.questions.map((question: any) => (
          <div key={question.id} className="mb-4">
            <label className="block text-lg mb-2">{question.text}</label>

            {question.type === "Numeric" && (
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg"
                defaultValue={question.default_value}
              />
            )}

            {question.type === "Dropdown" && (
              <select className="w-full px-3 py-2 border rounded-lg">
                {question.default_value.split(",").map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {question.type === "Confirm" && (
              <input
                type="checkbox"
                className="w-5 h-5"
                defaultChecked={question.default_value === "true"}
              />
            )}
          </div>
        ))}

        <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          Save
        </button>
      </form>

      <button
        onClick={() => router.push("/dashboard")}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
