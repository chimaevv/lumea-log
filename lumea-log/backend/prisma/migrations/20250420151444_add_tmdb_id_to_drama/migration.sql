/*
  Warnings:

  - A unique constraint covering the columns `[tmdbId]` on the table `Drama` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Drama" ADD COLUMN     "tmdbId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Drama_tmdbId_key" ON "Drama"("tmdbId");
