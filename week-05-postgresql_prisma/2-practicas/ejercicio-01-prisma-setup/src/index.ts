import "dotenv/config";
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

// GET /visitantes
app.get("/visitantes", async (req: Request, res: Response) => {
  const visitantes = await prisma.visitante.findMany({ orderBy: { id: "asc" } });
  res.json({ success: true, data: visitantes, meta: { total: visitantes.length } });
});

// GET /visitantes/:id
app.get("/visitantes/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const visitante = await prisma.visitante.findUnique({ where: { id } });

  if (!visitante) {
    return res.status(404).json({
      success: false,
      error: { message: "Visitante no encontrado", code: "NOT_FOUND" }
    });
  }

  res.json({ success: true, data: visitante });
});

// POST /visitantes
app.post("/visitantes", async (req: Request, res: Response) => {
  const { nombre, edad, tienePase } = req.body;

  if (!nombre || edad === undefined) {
    return res.status(400).json({
      success: false,
      error: { message: "Faltan campos obligatorios: nombre, edad", code: "VALIDATION_ERROR" }
    });
  }

  const nuevoVisitante = await prisma.visitante.create({
    data: { nombre, edad, tienePase: tienePase ?? false }
  });

  res.status(201).json({ success: true, data: nuevoVisitante });
});

// PUT /visitantes/:id
app.put("/visitantes/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const actualizado = await prisma.visitante.update({
      where: { id },
      data: req.body
    });

    res.json({ success: true, data: actualizado });
  } catch (err) {
    res.status(404).json({
      success: false,
      error: { message: "Visitante no encontrado", code: "NOT_FOUND" }
    });
  }
});

// DELETE /visitantes/:id
app.delete("/visitantes/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const eliminado = await prisma.visitante.delete({ where: { id } });
    res.json({ success: true, data: eliminado });
  } catch (err) {
    res.status(404).json({
      success: false,
      error: { message: "Visitante no encontrado", code: "NOT_FOUND" }
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Ejercicio 01 (Prisma setup) corriendo en http://localhost:${PORT}`);
});