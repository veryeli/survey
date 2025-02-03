import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create an organization
  const organization = await prisma.organization.create({
    data: { name: "Default Organization" },
  });

  // Create a site
  const site = await prisma.site.create({
    data: {
      address: "123 Default St",
      organizationId: organization.id,
    },
  });

  // Create a user
  const user = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: "admin123",  // In production, hash passwords!
      organizationId: organization.id,
    },
  });

  // Create a survey
  const survey = await prisma.survey.create({
    data: {
      year: 2024,
      season: "Spring",
      pages: {
        create: [
          {
            title: "Basic Info",
            questions: {
              create: [
                { text: "People in Region", type: "Numeric", defaultValue: "0" },
                { text: "People Served Per Month", type: "Numeric", defaultValue: "0" },
                { text: "Completed", type: "Confirm", defaultValue: "false" },
              ],
            },
          },
        ],
      },
    },
  });

  // Create a site survey
  await prisma.siteSurvey.create({
    data: {
      siteId: site.id,
      surveyId: survey.id,
    },
  });

  console.log("Database seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
