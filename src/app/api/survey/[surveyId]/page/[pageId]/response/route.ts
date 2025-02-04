"use client";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { QuestionResponse } from "@/types/models";

const prisma = new PrismaClient();

interface RequestParams {
  surveyId: string;
  pageId: string;
}

interface RequestBody {
  siteSurveyId: number;
  responses: QuestionResponse[];
}

export async function POST(request: Request, { }: { params: RequestParams }) {
  const { responses }: RequestBody = await request.json();

  for (const response of responses) {
    await prisma.questionResponse.upsert({
      where: {
        id: response.id,
      },
      update: { value: response.value },
      create: {
        sitePageId: response.sitePageId ?? 0,
        questionId: response.questionId,
        value: response.value,
      },
    });
  }

  return NextResponse.json({ message: "Responses saved successfully!" });
}
