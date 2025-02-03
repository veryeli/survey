import { NextResponse } from "next/server";

export async function GET() {
  // Simulated survey data for now (replace with database logic later)
  const surveys = [
    { id: 1, title: "Spring 2024 Needs Assessment", progress: "Completed" },
    { id: 2, title: "Fall 2024 Needs Assessment", progress: "Incomplete" },
  ];

  return NextResponse.json(surveys);
}
