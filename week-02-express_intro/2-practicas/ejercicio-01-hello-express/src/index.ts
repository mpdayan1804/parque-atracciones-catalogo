import express, { type Request, type Response } from "express";

const app = express();
app.use(express.json());

interface Visitante {
  id: number;
  nombre: string;
  edad: number;
  tienePase: boolean;
}

const visitantes: Visitante[] = [
  { id: 1, nombre: "Laura Gómez", edad: 28, tienePase: true },
  { id: 2, nombre: "Carlos Ruiz", edad: 34, tienePase: false },
  { id: 3, nombre: "Ana Torres", edad: 19, tienePase: true }
];

// GET /visitantes -> lista todos
app.get("/visitantes", (req: Request, res: Response) => {
  res.json(visitantes);
});

// GET /visitantes/:id -> obtiene uno
app.get("/visitantes/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const visitante = visitantes.find((v) => v.id === id);

  if (!visitante) {
    return res.status(404).json({ error: "Visitante no encontrado" });
  }

  res.json(visitante);
});

// POST /visitantes -> crea uno nuevo
app.post("/visitantes", (req: Request, res: Response) => {
  const { nombre, edad, tienePase } = req.body;

  if (!nombre || edad === undefined) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const nuevoVisitante: Visitante = {
    id: visitantes.length > 0 ? Math.max(...visitantes.map((v) => v.id)) + 1 : 1,
    nombre,
    edad,
    tienePase: tienePase ?? false
  };

  visitantes.push(nuevoVisitante);
  res.status(201).json(nuevoVisitante);
});

// PUT /visitantes/:id -> actualiza uno
app.put("/visitantes/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = visitantes.findIndex((v) => v.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Visitante no encontrado" });
  }

  const { nombre, edad, tienePase } = req.body;
  const visitanteActual = visitantes[index]!;

  visitantes[index] = {
    ...visitanteActual,
    nombre: nombre ?? visitanteActual.nombre,
    edad: edad ?? visitanteActual.edad,
    tienePase: tienePase ?? visitanteActual.tienePase
  };

  res.json(visitantes[index]);
});

// DELETE /visitantes/:id -> elimina uno
app.delete("/visitantes/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = visitantes.findIndex((v) => v.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Visitante no encontrado" });
  }

  const eliminado = visitantes.splice(index, 1)[0];
  res.json({ mensaje: "Visitante eliminado", visitante: eliminado });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Ejercicio 01 corriendo en http://localhost:${PORT}`);
});    