import { NextResponse } from "next/server";
import surveys from "../../../mock/surveys.json";

// Helper function to determine the latest survey
function getMostRecentSurvey(surveys: any[]) {
  // Define season order for comparison
  const seasonOrder = ["Winter", "Spring", "Summer", "Fall"];

  return surveys.reduce((latest, current) => {
    if (
      current.year > latest.year ||
      (current.year === latest.year &&
        seasonOrder.indexOf(current.season) > seasonOrder.indexOf(latest.season))
    ) {
      return current;
    }
    return latest;
  }, surveys[0]);
}

export async function GET() {
  const latestSurvey = getMostRecentSurvey(surveys);
  return NextResponse.json([latestSurvey]);  // Return as an array for consistency
}
