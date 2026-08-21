-- CreateEnum
CREATE TYPE "EstadoMantenimiento" AS ENUM ('pendiente', 'en_proceso', 'completado');

-- CreateTable
CREATE TABLE "atracciones" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "atracciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mantenimientos" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" "EstadoMantenimiento" NOT NULL DEFAULT 'pendiente',
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atraccionId" INTEGER NOT NULL,

    CONSTRAINT "mantenimientos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mantenimientos" ADD CONSTRAINT "mantenimientos_atraccionId_fkey" FOREIGN KEY ("atraccionId") REFERENCES "atracciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
