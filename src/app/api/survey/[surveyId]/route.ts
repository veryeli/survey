import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request, context: { params: { surveyId: string } }) {
  try {
    const surveyId = parseInt(context.params.surveyId, 10);
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        pages: {
          include: { questions: true },
        },
      },
    });

    if (!survey) {
      return NextResponse.json({ message: "Survey not found" }, { status: 404 });
    }

    return NextResponse.json(survey);
  } catch (error) {
    console.error("Error fetching survey:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
