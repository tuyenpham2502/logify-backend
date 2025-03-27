/*
  Warnings:

  - A unique constraint covering the columns `[githubId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "githubId" TEXT,
ADD COLUMN     "refreshToken" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");
