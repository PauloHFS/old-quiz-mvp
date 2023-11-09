/*
  Warnings:

  - You are about to drop the column `responseUserInfoId` on the `Response` table. All the data in the column will be lost.
  - Added the required column `quizId` to the `ResponseUserInfo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_responseUserInfoId_fkey";

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "responseUserInfoId";

-- AlterTable
ALTER TABLE "ResponseUserInfo" ADD COLUMN     "quizId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ResponseUserInfo" ADD CONSTRAINT "ResponseUserInfo_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
