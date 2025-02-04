// src/types/models.ts

export interface Question {
  id: number;
  text: string;
  type: "Numeric" | "Dropdown" | "MultiSelect" | "Short Response" | "Long Response" | "Confirm" | "SizingGrid";
  defaultValue?: string;
}

export interface Page {
  id: number;
  title: string;
  surveyId: number;
  questions: Question[];
}

export interface Survey {
  id: number;
  year: number;
  season: string;
  pages: Page[];
}

export interface QuestionResponse {
  sitePageId: number | undefined;
  id: number;
  questionId: number;
  value: string;
}

export interface SitePage {
  id: number;
  siteSurveyId: number;
  confirmed: boolean;
  page: {
    id: number;
    title: string;
    questions: Question[];
  };
  responses: QuestionResponse[];
}

export interface SiteSurvey {
  id: number;
  siteId: number;
  surveyId: number;
  sitePages: SitePage[];
  survey: Survey;
}

export interface Site {
  id: number;
  address: string;
  users: User[];
  siteSurveys: SiteSurvey[];
}

export interface User {
  id: string;  // Remember, NextAuth expects id as string
  email: string;
  siteID: number;
  site: Site;
}
