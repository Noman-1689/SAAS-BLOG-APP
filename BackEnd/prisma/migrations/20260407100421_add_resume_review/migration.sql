-- CreateTable
CREATE TABLE "ResumeReview" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "ResumeReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResumeReview" ADD CONSTRAINT "ResumeReview_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
