import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, context: { params: { surveyId: string, pageId: string } }) {
  const { pageId } = context.params;

  try {
    const page = await prisma.page.findUnique({
      where: { id: parseInt(pageId, 10) },
      include: { questions: true },  // Include questions if needed
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (err) {  // Changed from `error` to `err` to avoid conflicts
    console.error("Failed to fetch page:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
