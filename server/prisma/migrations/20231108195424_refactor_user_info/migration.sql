/*
  Warnings:

  - You are about to drop the `QuizUserInfo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `responseUserInfoId` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QuizUserInfo" DROP CONSTRAINT "QuizUserInfo_quizId_fkey";

-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "responseUserInfoId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "QuizUserInfo";

-- CreateTable
CREATE TABLE "ResponseUserInfo" (
    "id" SERIAL NOT NULL,
    "gender" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "geolocation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResponseUserInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_responseUserInfoId_fkey" FOREIGN KEY ("responseUserInfoId") REFERENCES "ResponseUserInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
