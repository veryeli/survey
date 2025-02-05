import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Step 1: Delete existing data
  await prisma.questionResponse.deleteMany();
  await prisma.question.deleteMany();
  await prisma.siteSurvey.deleteMany();
  await prisma.page.deleteMany();
  await prisma.survey.deleteMany();
  await prisma.site.deleteMany();
  await prisma.user.deleteMany();

  console.log("Existing surveys, pages, and questions deleted.");

  // Step 3: Create Sites
  const site1 = await prisma.site.create({ data: { address: "123 Main St" } });
  const site2 = await prisma.site.create({ data: { address: "456 Elm St" } });

  // Step 4: Create Users with hashed passwords
  const password1 = await bcrypt.hash("password123", 10);
  const password2 = await bcrypt.hash("password123", 10);

  await prisma.user.create({
    data: {
      email: "user1@example.com",
      password: password1,
      site: {
        connect: { id: site1.id }, // Connect the user to site1
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "user2@example.com",
      password: password2,
      site: {
        connect: { id: site2.id }, // Connect the user to site2
      },
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
                { text: "People in Region", type: "Numeric", defaultValue: "" },
                { text: "People Served Per Month", type: "Numeric", defaultValue: "" },
                { text: "Men Served", type: "Numeric", defaultValue: "" },
                { text: "Women Served", type: "Numeric", defaultValue: "" },
                { text: "Boys Served", type: "Numeric", defaultValue: "" },
                { text: "Girls Served", type: "Numeric", defaultValue: "" },
                { text: "Infants Served", type: "Numeric", defaultValue: "" },
                { text: "Needs Served", type: "MultiSelect", defaultValue: "", options: ["Hygiene", "Shelter", "Food", "Clothing"] },
              ],
            },
          },
          {
            title: "Hygiene",
            questions: {
              create: [
                { text: "How many hygiene kits are distributed monthly?", type: "Numeric", defaultValue: "" },
                { text: "Are hygiene products gender-specific?", type: "Dropdown", defaultValue: "", options: ["Yes", "No"] },
              ],
            },
          },
          {
            title: "Shelter",
            questions: {
              create: [
                { text: "Number of temporary shelters available?", type: "Numeric", defaultValue: "" },
                { text: "Average length of stay in shelters?", type: "Numeric", defaultValue: "" },
              ],
            },
          },
          {
            title: "Food",
            questions: {
              create: [
                { text: "Meals provided per day?", type: "Numeric", defaultValue: "" },
                { text: "Are special dietary needs accommodated?", type: "Dropdown", defaultValue: "", options: ["Yes", "No"] },
              ],
            },
          },
          {
            title: "Clothing",
            questions: {
              create: [
                { text: "Number of clothing items distributed monthly?", type: "Numeric", defaultValue: "" },
                { text: "Are seasonal clothes provided?", type: "Dropdown", defaultValue: "", options: ["Yes", "No"] },
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
