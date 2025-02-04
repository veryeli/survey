import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { surveyId: string } }) {
  // Directly access params without awaiting
  const surveyId = parseInt(params.surveyId, 10);

  try {
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: { pages: { include: { questions: true } } },
    });

    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    return NextResponse.json(survey);
  } catch (error) {
    console.error("Error fetching survey:", error);
    return NextResponse.json({ error: "Failed to fetch survey" }, { status: 500 });
  }
}
