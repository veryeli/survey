import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET({ params }: { params: { pageId: string } }) {
  const { pageId } = params;

  const page = await prisma.page.findUnique({
    where: { id: parseInt(pageId) },
    include: {
      questions: {
        include: {
          responses: true,  // Load responses
        },
      },
    },
  });

  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  return NextResponse.json(page);
}

