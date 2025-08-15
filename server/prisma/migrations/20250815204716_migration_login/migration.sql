-- CreateEnum
CREATE TYPE "public"."Rol" AS ENUM ('CLIENTE', 'AVAL', 'NINGUNO');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ROOT', 'ADMIN', 'VIEWER');

-- CreateTable
CREATE TABLE "public"."Contacts" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "cellphone" TEXT NOT NULL,
    "curp" TEXT NOT NULL,
    "streetNumber" TEXT,
    "colony" TEXT,
    "city" TEXT,
    "state" TEXT,
    "role" "public"."Rol" NOT NULL DEFAULT 'NINGUNO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Contacts_lastName_idx" ON "public"."Contacts"("lastName");

-- CreateIndex
CREATE INDEX "Contacts_curp_idx" ON "public"."Contacts"("curp");

-- CreateIndex
CREATE INDEX "Contacts_cellphone_idx" ON "public"."Contacts"("cellphone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");
