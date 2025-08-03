-- CreateEnum
CREATE TYPE "public"."Alignment" AS ENUM ('GOOD', 'NEUTRAL', 'BAD');

-- CreateEnum
CREATE TYPE "public"."Rating" AS ENUM ('VERY_NICE', 'SOMEWHAT_NICE', 'NEITHER_NICE_NOR_MEAN', 'SOMEWHAT_MEAN', 'VERY_MEAN', 'SKIPPED');

-- CreateTable
CREATE TABLE "public"."DataPolicy" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pony" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "derpiUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "primaryColor" TEXT NOT NULL,
    "baseAlignment" "public"."Alignment" NOT NULL DEFAULT 'NEUTRAL',

    CONSTRAINT "Pony_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PonyRating" (
    "id" SERIAL NOT NULL,
    "ponyId" INTEGER NOT NULL,
    "sessionId" TEXT NOT NULL,
    "rating" "public"."Rating" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PonyRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DataPolicy_sessionId_key" ON "public"."DataPolicy"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Pony_name_key" ON "public"."Pony"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PonyRating_ponyId_sessionId_key" ON "public"."PonyRating"("ponyId", "sessionId");

-- AddForeignKey
ALTER TABLE "public"."PonyRating" ADD CONSTRAINT "PonyRating_ponyId_fkey" FOREIGN KEY ("ponyId") REFERENCES "public"."Pony"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
