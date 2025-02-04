-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "siteId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "season" TEXT NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "surveyId" INTEGER NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "defaultValue" TEXT NOT NULL,
    "pageId" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSurvey" (
    "id" SERIAL NOT NULL,
    "siteId" INTEGER NOT NULL,
    "surveyId" INTEGER NOT NULL,

    CONSTRAINT "SiteSurvey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SitePage" (
    "id" SERIAL NOT NULL,
    "siteSurveyId" INTEGER NOT NULL,
    "pageId" INTEGER NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SitePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionResponse" (
    "id" SERIAL NOT NULL,
    "sitePageId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "QuestionResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionResponse_sitePageId_questionId_key" ON "QuestionResponse"("sitePageId", "questionId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSurvey" ADD CONSTRAINT "SiteSurvey_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSurvey" ADD CONSTRAINT "SiteSurvey_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SitePage" ADD CONSTRAINT "SitePage_siteSurveyId_fkey" FOREIGN KEY ("siteSurveyId") REFERENCES "SiteSurvey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SitePage" ADD CONSTRAINT "SitePage_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionResponse" ADD CONSTRAINT "QuestionResponse_sitePageId_fkey" FOREIGN KEY ("sitePageId") REFERENCES "SitePage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionResponse" ADD CONSTRAINT "QuestionResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
