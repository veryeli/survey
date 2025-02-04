import { NextResponse } from "next/server";
import { PrismaClient, QuestionResponse } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  context: { params: { surveyId: string; pageId: string } }
) {
  const { surveyId, pageId } = context.params;

  // Get the page with its questions
  const page = await prisma.page.findUnique({
    where: { id: parseInt(pageId, 10) },
    include: { questions: true },
  });
  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  // Get session info to know which user's responses to fetch
  const session = await getServerSession(authOptions);
  let responses: QuestionResponse[] = [];

  if (session && session.user?.email) {
    // Get the user's site id
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { siteId: true },
    });

    if (user) {
      // Look up the sitePage for this page, survey and user’s site
      const sitePage = await prisma.sitePage.findFirst({
        where: {
          pageId: parseInt(pageId, 10),
          siteSurvey: {
            surveyId: parseInt(surveyId, 10),
            siteId: user.siteId,
          },
        },
        include: { responses: true },
      });
      if (sitePage) {
        responses = sitePage.responses;
      }
    }
  }

  // Return the page info along with responses (if any)
  return NextResponse.json({
    title: page.title,
    questions: page.questions,
    responses,
  });
}
