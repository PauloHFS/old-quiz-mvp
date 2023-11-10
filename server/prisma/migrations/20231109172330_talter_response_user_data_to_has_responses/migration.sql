/*
  Warnings:

  - Added the required column `responseUserInfoId` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "responseUserInfoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_responseUserInfoId_fkey" FOREIGN KEY ("responseUserInfoId") REFERENCES "ResponseUserInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
