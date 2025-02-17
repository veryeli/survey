"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SiteSurvey, Survey } from "@/types/models";
import LoadingSpinner from "@/components/LoadingSpinner";
import { pages } from "next/dist/build/templates/app-page";
import { Text, Button, Box, Heading, Container, Separator, Grid, Flex } from "@radix-ui/themes";


export default function Dashboard() {
  const { data: session, status } = useSession();
  const [siteSurvey, setSiteSurvey] = useState<SiteSurvey | null>(null);
  const [surveyDetails, setSurveyDetails] = useState<Survey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // const dashboardPage = pages.filter(page => 
  //   page.title === 'Basic' || page.title === 'Demographics'
  // )

  useEffect(() => {
    if (status === "loading") return; // Wait until session is loaded

    if (!session) {
      router.push("/about");
      return;
    }

    fetch("/api/site-survey")
      .then((res) => {
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Full API response:", data);
        const ss: SiteSurvey = data.siteSurvey;
        setSiteSurvey(ss);
        return fetch(`/api/survey/${ss.surveyId}`);
      })
      .then((res) => {
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
      })
      .then((survey: Survey) => setSurveyDetails(survey))
      .catch((err) => setError(err.message));
  }, [session, status, router]);

  if (status === "loading" || !siteSurvey || !surveyDetails)
    return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  //Add code to Initialize survey status

  return (
    <Container className="w-full h-full bg-gray-100">
      <Flex direction="column" align="center" justify="center" gap="4">
        <Box align="center" justify="center" className="w-max-4xl mx-auto m-8">
          <Text size="4" weight="bold" mb="6" className="text-[var(--primary)] ">
          DASHBOARD
          </Text>
          <Separator className="border-t-[3px] border-black m-10" />
          <Text size="3" className="text-blue-900">Choose a category to fill up.</Text>
          <Grid columns={{ initial: "1", md: "2" }} className="gap-5 mt-6">

              {siteSurvey.survey.pages.slice(0,2).map((page) => (
                <Flex
                  key={page.id}
                  direction="column" justify="between"  align="center" width="350px" height="200px" className="bg-[var(--secondary)] border p-8 rounded-lg shadow-sm justify-between items-center"
                >
                  <Text mb="4" className="text-2xl font-medium text-blue-900">{page.title}</Text>
                  <Button
                   className="bg-blue-500 text-white border rounded hover:bg-blue-600 text-md"
                    onClick={() =>
                      router.push(`/survey/${siteSurvey.survey.id}/page/${page.id}`)
                    }
                  >
                    Start
                  </Button>
                </Flex>
              ))}
            
          </Grid>
        </Box>
      </Flex>
    </Container>
  );
}

