import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Step 1: Delete existing data
  await prisma.questionResponse.deleteMany();
  await prisma.siteSurvey.deleteMany();
  await prisma.page.deleteMany();
  await prisma.survey.deleteMany();
  await prisma.site.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();


  console.log("Existing surveys, pages, and questions deleted.");

  // Step 2: Create Organizations
  const org1 = await prisma.organization.create({ data: { name: "Organization One" } });
  const org2 = await prisma.organization.create({ data: { name: "Organization Two" } });

  // Step 3: Create Sites
  const site1 = await prisma.site.create({ data: { address: "123 Main St", organizationId: org1.id } });
  const site2 = await prisma.site.create({ data: { address: "456 Elm St", organizationId: org2.id } });

  // Step 4: Create Users with hashed passwords
  const password1 = await bcrypt.hash("password123", 10);
  const password2 = await bcrypt.hash("password123", 10);

  await prisma.user.create({
    data: {
      email: "user1@example.com",
      password: password1,
      organizationId: org1.id,
    },
  });

  await prisma.user.create({
    data: {
      email: "user2@example.com",
      password: password2,
      organizationId: org2.id,
    },
  });

  // Step 5: Create a Survey with Pages and Questions
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
                { text: "Men Served", type: "Numeric", defaultValue: "0" },
                { text: "Women Served", type: "Numeric", defaultValue: "0" },
                { text: "Boys Served", type: "Numeric", defaultValue: "0" },
                { text: "Girls Served", type: "Numeric", defaultValue: "0" },
                { text: "Infants Served", type: "Numeric", defaultValue: "0" },
                { text: "Needs Served", type: "MultiSelect", defaultValue: "Hygiene,Shelter,Food,Clothing" },
              ],
            },
          },
          {
            title: "Hygiene",
            questions: {
              create: [
                { text: "How many hygiene kits are distributed monthly?", type: "Numeric", defaultValue: "0" },
                { text: "Are hygiene products gender-specific?", type: "Dropdown", defaultValue: "Yes,No" },
              ],
            },
          },
          {
            title: "Shelter",
            questions: {
              create: [
                { text: "Number of temporary shelters available?", type: "Numeric", defaultValue: "0" },
                { text: "Average length of stay in shelters?", type: "Numeric", defaultValue: "0" },
              ],
            },
          },
          {
            title: "Food",
            questions: {
              create: [
                { text: "Meals provided per day?", type: "Numeric", defaultValue: "0" },
                { text: "Are special dietary needs accommodated?", type: "Dropdown", defaultValue: "Yes,No" },
              ],
            },
          },
          {
            title: "Clothing",
            questions: {
              create: [
                { text: "Number of clothing items distributed monthly?", type: "Numeric", defaultValue: "0" },
                { text: "Are seasonal clothes provided?", type: "Dropdown", defaultValue: "Yes,No" },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.siteSurvey.create({ data: { siteId: site1.id, surveyId: survey.id } });
  await prisma.siteSurvey.create({ data: { siteId: site2.id, surveyId: survey.id } });

  console.log("Database seeded successfully.");
}

// Run the seeding script
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
