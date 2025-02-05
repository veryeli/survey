"use client";

import React from "react";
import { Question } from "@/types/models";

interface SurveyFormProps {
  title: string;
  questions: Question[];
  responses: { [key: number]: string };
  onInputChange: (questionId: number, value: string) => void;
  onSubmit: (confirm: boolean) => void;
}

const SurveyForm: React.FC<SurveyFormProps> = ({
  title,
  questions,
  responses,
  onInputChange,
  onSubmit,
}) => {
  return (
    <div className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {questions.map((question) => (
          <div key={question.id}>
            <label className="block text-lg font-medium">{question.text}</label>
            <input
              type="text"
              className="mt-1 p-2 border text-gray-900 rounded w-full"
              value={responses[question.id]}
              onChange={(e) => onInputChange(question.id, e.target.value)}
            />
          </div>
        ))}
        <div className="flex space-x-4">
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => onSubmit(false)}
          >
            Save
          </button>
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => onSubmit(true)}
          >
            Save & Confirm
          </button>
        </div>
      </form>
    </div>
  );
};

export default SurveyForm;
