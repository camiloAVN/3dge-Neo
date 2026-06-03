-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "cargo" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
