import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.atraccion.deleteMany();

  await prisma.atraccion.createMany({
    data: [
      { nombre: "Montaña Rusa Fénix", categoria: "extrema", precio: 25000, capacidad: 24, alturaMinima: 140, activa: true },
      { nombre: "Río Rápido", categoria: "acuatica", precio: 18000, capacidad: 12, alturaMinima: 110, activa: true },
      { nombre: "Carrusel Encantado", categoria: "infantil", precio: 10000, capacidad: 20, alturaMinima: 0, activa: true },
      { nombre: "Rueda de la Fortuna", categoria: "familiar", precio: 15000, capacidad: 32, alturaMinima: 90, activa: true },
      { nombre: "Caída Libre Extrema", categoria: "extrema", precio: 30000, capacidad: 8, alturaMinima: 150, activa: true },
      { nombre: "Splash Mountain", categoria: "acuatica", precio: 20000, capacidad: 10, alturaMinima: 120, activa: true },
      { nombre: "Tren Infantil", categoria: "infantil", precio: 8000, capacidad: 16, alturaMinima: 0, activa: true },
      { nombre: "Casa del Terror", categoria: "familiar", precio: 17000, capacidad: 14, alturaMinima: 100, activa: true },
      { nombre: "Tazas Locas", categoria: "infantil", precio: 9000, capacidad: 18, alturaMinima: 90, activa: true },
      { nombre: "Torre del Pánico", categoria: "extrema", precio: 28000, capacidad: 6, alturaMinima: 145, activa: false }
    ]
  });

  console.log("Seed completado: 10 atracciones insertadas");
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });