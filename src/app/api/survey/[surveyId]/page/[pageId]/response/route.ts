import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  const { surveyId, pageId } = params;
  const { siteSurveyId, responses } = await request.json();

  for (const response of responses) {
    await prisma.questionResponse.upsert({
      where: {
        sitePageId_questionId: {
          sitePageId: response.sitePageId,
          questionId: response.questionId,
        },
      },
      update: { value: response.value },
      create: {
        sitePageId: response.sitePageId,
        questionId: response.questionId,
        value: response.value,
      },
    });
  }

  return NextResponse.json({ message: "Responses saved successfully!" });
}

