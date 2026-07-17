-- AlterTable
ALTER TABLE "Podcast" ADD COLUMN     "ownerId" TEXT;

-- AddForeignKey
ALTER TABLE "Podcast" ADD CONSTRAINT "Podcast_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
