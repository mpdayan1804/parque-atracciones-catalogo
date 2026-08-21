import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.mantenimiento.deleteMany();
  await prisma.atraccion.deleteMany();

  const fenix = await prisma.atraccion.create({
    data: {
      nombre: "Montaña Rusa Fénix",
      categoria: "extrema",
      activa: true,
      mantenimientos: {
        create: [
          { descripcion: "Revisión de frenos", estado: "completado" },
          { descripcion: "Lubricación de rieles", estado: "pendiente" }
        ]
      }
    }
  });

  const rio = await prisma.atraccion.create({
    data: {
      nombre: "Río Rápido",
      categoria: "acuatica",
      activa: true,
      mantenimientos: {
        create: [
          { descripcion: "Limpieza de filtros de agua", estado: "en_proceso" }
        ]
      }
    }
  });

  await prisma.atraccion.create({
    data: {
      nombre: "Carrusel Encantado",
      categoria: "infantil",
      activa: true
      // Sin mantenimientos — para probar el caso de una atracción sin registros relacionados
    }
  });

  console.log(`Seed completado: 3 atracciones, ${2 + 1} mantenimientos insertados`);
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });