import "dotenv/config";
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

// GET /atracciones -> incluye sus mantenimientos relacionados
app.get("/atracciones", async (req: Request, res: Response) => {
  const atracciones = await prisma.atraccion.findMany({
    include: { mantenimientos: true },
    orderBy: { id: "asc" }
  });

  res.json({ success: true, data: atracciones, meta: { total: atracciones.length } });
});

// GET /atracciones/:id -> con sus mantenimientos
app.get("/atracciones/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const atraccion = await prisma.atraccion.findUnique({
    where: { id },
    include: { mantenimientos: true }
  });

  if (!atraccion) {
    return res.status(404).json({
      success: false,
      error: { message: "Atracción no encontrada", code: "NOT_FOUND" }
    });
  }

  res.json({ success: true, data: atraccion });
});

// POST /atracciones/:id/mantenimientos -> agrega un mantenimiento a una atracción existente
app.post("/atracciones/:id/mantenimientos", async (req: Request, res: Response) => {
  const atraccionId = Number(req.params.id);
  const { descripcion, estado } = req.body;

  if (!descripcion) {
    return res.status(400).json({
      success: false,
      error: { message: "El campo 'descripcion' es obligatorio", code: "VALIDATION_ERROR" }
    });
  }

  try {
    const nuevoMantenimiento = await prisma.mantenimiento.create({
      data: { descripcion, estado, atraccionId }
    });

    res.status(201).json({ success: true, data: nuevoMantenimiento });
  } catch (err) {
    // Si atraccionId no existe, Prisma lanza un error de FK (P2003)
    res.status(404).json({
      success: false,
      error: { message: "La atracción especificada no existe", code: "NOT_FOUND" }
    });
  }
});

// GET /mantenimientos -> lista todos, incluyendo el nombre de su atracción
app.get("/mantenimientos", async (req: Request, res: Response) => {
  const mantenimientos = await prisma.mantenimiento.findMany({
    include: { atraccion: { select: { nombre: true, categoria: true } } },
    orderBy: { id: "asc" }
  });

  res.json({ success: true, data: mantenimientos, meta: { total: mantenimientos.length } });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Ejercicio 02 (relaciones) corriendo en http://localhost:${PORT}`);
});
