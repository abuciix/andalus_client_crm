-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "coverImageUrl" TEXT,
ADD COLUMN     "galleryImageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
