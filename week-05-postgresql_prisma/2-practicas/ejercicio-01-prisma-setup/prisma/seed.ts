import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.visitante.deleteMany();

  await prisma.visitante.createMany({
    data: [
      { nombre: "Laura Gómez", edad: 28, tienePase: true },
      { nombre: "Carlos Ruiz", edad: 34, tienePase: false },
      { nombre: "Ana Torres", edad: 19, tienePase: true }
    ]
  });

  console.log("Seed completado: 3 visitantes insertados");
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });