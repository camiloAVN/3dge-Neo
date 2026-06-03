-- CreateTable
CREATE TABLE "public"."AppSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "adminEmail" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("id")
);
