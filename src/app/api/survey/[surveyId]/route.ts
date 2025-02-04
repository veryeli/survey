import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { surveyId } = params;

  const survey = await prisma.survey.findUnique({
    where: { id: parseInt(surveyId) },
    include: { pages: { include: { questions: true } } },  // Load pages and questions
  });

  if (!survey) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  return NextResponse.json(survey);
}

