import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { SiteSurvey } from "@/types/models";  // Import the interface

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      site: {
            include: {
              siteSurveys: {
                include: {
                  survey: {
                    include: {
                      pages: {
                        include: {
                          questions: true
                        }
                      }
                    }
                  },
                  sitePages: {
                    include: {
                      responses: true
                    }
                  }
                }
              }
            }
          }
    }
  });

  console.log("User:", user);
  console.log("Site:", user.site);


  // Handle cases where user or site is missing
  if (!user || user.organization.sites.length === 0) {
    return NextResponse.json({ error: "No site or surveys found" }, { status: 404 });
  }

  // Get the first SiteSurvey associated with the user's organization and site
  const siteSurvey: SiteSurvey = user.organization.sites[0].siteSurveys[0];

  if (!siteSurvey) {
    return NextResponse.json({ error: "No SiteSurvey found" }, { status: 404 });
  }

  return NextResponse.json({
    siteId: siteSurvey.siteId,  // Include siteId in the response
    survey: siteSurvey.survey,
  });
}
