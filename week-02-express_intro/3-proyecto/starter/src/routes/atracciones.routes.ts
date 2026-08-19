import { Router, Request, Response } from "express";
import { atracciones } from "../data/atracciones.js";
import type { Atraccion } from "../types.js";

const router = Router();

// GET /atracciones -> lista todas (con filtro opcional por categoría via query)
router.get("/", (req: Request, res: Response) => {
  const { categoria } = req.query;

  if (categoria) {
    const filtradas = atracciones.filter(
      (a) => a.categoria === categoria
    );
    return res.json(filtradas);
  }

  res.json(atracciones);
});

// GET /atracciones/:id -> obtiene una por id
router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const atraccion = atracciones.find((a) => a.id === id);

  if (!atraccion) {
    return res.status(404).json({ error: "Atracción no encontrada" });
  }

  res.json(atraccion);
});

// POST /atracciones -> crea una nueva
router.post("/", (req: Request, res: Response) => {
  const { nombre, categoria, precio, capacidad, alturaMinima, activa } = req.body;

  if (!nombre || !categoria || precio === undefined || capacidad === undefined) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const nuevaAtraccion: Atraccion = {
    id: atracciones.length > 0 ? Math.max(...atracciones.map((a) => a.id)) + 1 : 1,
    nombre,
    categoria,
    precio,
    capacidad,
    alturaMinima: alturaMinima ?? 0,
    activa: activa ?? true
  };

  atracciones.push(nuevaAtraccion);
  res.status(201).json(nuevaAtraccion);
});

// PUT /atracciones/:id -> actualiza una existente
router.put("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = atracciones.findIndex((a) => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Atracción no encontrada" });
  }

  const { nombre, categoria, precio, capacidad, alturaMinima, activa } = req.body;

  atracciones[index] = {
    ...atracciones[index],
    nombre: nombre ?? atracciones[index].nombre,
    categoria: categoria ?? atracciones[index].categoria,
    precio: precio ?? atracciones[index].precio,
    capacidad: capacidad ?? atracciones[index].capacidad,
    alturaMinima: alturaMinima ?? atracciones[index].alturaMinima,
    activa: activa ?? atracciones[index].activa
  };

  res.json(atracciones[index]);
});

// DELETE /atracciones/:id -> elimina una
router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = atracciones.findIndex((a) => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Atracción no encontrada" });
  }

  const eliminada = atracciones.splice(index, 1)[0];
  res.json({ mensaje: "Atracción eliminada", atraccion: eliminada });
});

export default router;