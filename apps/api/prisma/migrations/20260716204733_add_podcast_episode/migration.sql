/*
  Warnings:

  - Added the required column `podcastId` to the `Episode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Episode" ADD COLUMN     "audioUrl" TEXT,
ADD COLUMN     "podcastId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Podcast" ADD COLUMN     "artworkUrl" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "website" TEXT;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
