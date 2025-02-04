import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Step 1: Delete existing surveys and related data
  await prisma.question.deleteMany();
  await prisma.page.deleteMany();
  await prisma.survey.deleteMany();

  console.log("Existing surveys, pages, and questions deleted.");

  // Step 2: Create a new survey with pages and questions
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

  console.log("New survey created:", survey);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
