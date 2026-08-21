-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('mecanica', 'acuatica', 'infantil', 'extrema', 'familiar');

-- CreateTable
CREATE TABLE "atracciones" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" "Categoria" NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "alturaMinima" INTEGER NOT NULL DEFAULT 0,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "atracciones_pkey" PRIMARY KEY ("id")
);
