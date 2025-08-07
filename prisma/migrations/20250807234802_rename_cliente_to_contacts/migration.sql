-- CreateEnum
CREATE TYPE "public"."Rol" AS ENUM ('Cliente', 'Aval', 'Ninguno');

-- CreateTable
CREATE TABLE "public"."Contacts" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(20) NOT NULL,
    "apellidos" VARCHAR(30) NOT NULL,
    "celular" VARCHAR(10) NOT NULL,
    "curp" VARCHAR(25) NOT NULL,
    "calleNumero" VARCHAR(20) NOT NULL,
    "colonia" VARCHAR(20) NOT NULL,
    "ciudad" VARCHAR(25) NOT NULL,
    "estado" VARCHAR(20) NOT NULL,
    "rol" "public"."Rol" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);
