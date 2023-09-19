-- AlterTable
ALTER TABLE "users" ADD COLUMN     "imageUrl" VARCHAR(250),
ADD COLUMN     "imageUuid" VARCHAR(36),
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT false;
