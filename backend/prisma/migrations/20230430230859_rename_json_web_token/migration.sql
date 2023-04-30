/*
  Warnings:

  - You are about to drop the column `jsonwebToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "jsonwebToken",
ADD COLUMN     "jsonWebToken" TEXT;
