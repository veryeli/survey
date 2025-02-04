import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { surveyId: string; pageId: string } }) {
  const { surveyId, pageId } = params;

  try {
    const { responses, confirmed } = await request.json();
    console.log("Received responses:", responses);

    // Ensure data exists
    if (!responses || responses.length === 0) {
      return NextResponse.json({ error: "No responses provided" }, { status: 400 });
    }

    // Process responses
    for (const response of responses) {

      await prisma.questionResponse.upsert({
        where: {
          id: response.id || 0, // Adjust based on your unique field
        },
        update: {
          value: response.value,
        },
        create: {
          sitePageId: sitePage.id,
          questionId: response.questionId,
          value: response.value,
        },
      });
    }

    // Update confirmation status
    await prisma.sitePage.update({
      where: { id: parseInt(pageId, 10) },
      data: { confirmed: confirmed },
    });

    return NextResponse.json({ message: "Responses saved successfully!" });
  } catch (error) {
    console.error("Error saving responses:", error);
    return NextResponse.json({ error: "Failed to save responses." }, { status: 500 });
  }
}
