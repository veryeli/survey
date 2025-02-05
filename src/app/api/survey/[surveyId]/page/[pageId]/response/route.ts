import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"; // Adjust per your setup
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  context: { params: { surveyId: string; pageId: string } }
) {
  console.log("POST request received for survey:", context.params.surveyId, "page:", context.params.pageId);
  const params = await context.params;
  const surveyId = params.surveyId;
  const pageId = params.pageId;


  // Retrieve session and user email
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Look up the user to get the siteId
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { siteId: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Find the sitePage by matching pageId, surveyId, and the user's siteId
  const sitePage = await prisma.sitePage.findFirst({
    where: {
      pageId: parseInt(pageId, 10),
      siteSurvey: {
        surveyId: parseInt(surveyId, 10),
        siteId: user.siteId,
      },
    },
  });
  if (!sitePage) {
    return NextResponse.json({ error: "Site page not found" }, { status: 404 });
  }

  try {
    const { responses, confirmed } = await request.json();
    console.log("Received responses:", responses);

    if (!responses || responses.length === 0) {
      return NextResponse.json({ error: "No responses provided" }, { status: 400 });
    }

    // Upsert each response using the composite unique key
    for (const response of responses) {
      await prisma.questionResponse.upsert({
        where: {
          sitePageId_questionId: {
            sitePageId: sitePage.id,
            questionId: response.questionId,
          },
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

    // Update confirmation status on the site page
    await prisma.sitePage.update({
      where: { id: sitePage.id },
      data: { confirmed },
    });

    return NextResponse.json({ message: "Responses saved successfully!" });
  } catch (error) {
    console.error("Error saving responses:", error);
    return NextResponse.json({ error: "Failed to save responses." }, { status: 500 });
  }
}
