import express, { Request, Response, NextFunction } from "express";
import { z, ZodType } from "zod";

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

// Schemas Zod
const createVisitanteSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  edad: z.number().int().positive("La edad debe ser un entero positivo"),
  tienePase: z.boolean().optional()
});

const updateVisitanteSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
  edad: z.number().int().positive("La edad debe ser un entero positivo").optional(),
  tienePase: z.boolean().optional()
});

// Middleware de validación genérico (mismo patrón que el proyecto principal)
function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
      const mensajes = resultado.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      );

      return res.status(400).json({
        success: false,
        error: { message: mensajes.join(" | "), code: "VALIDATION_ERROR" }
      });
    }

    req.body = resultado.data;
    next();
  };
}

// GET /visitantes
app.get("/visitantes", (req: Request, res: Response) => {
  res.json({ success: true, data: visitantes, meta: { total: visitantes.length } });
});

// GET /visitantes/:id
app.get("/visitantes/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const visitante = visitantes.find((v) => v.id === id);

  if (!visitante) {
    return res.status(404).json({
      success: false,
      error: { message: "Visitante no encontrado", code: "NOT_FOUND" }
    });
  }

  res.json({ success: true, data: visitante });
});

// POST /visitantes -> con validación Zod
app.post("/visitantes", validate(createVisitanteSchema), (req: Request, res: Response) => {
  const nuevoVisitante: Visitante = {
    id: visitantes.length > 0 ? Math.max(...visitantes.map((v) => v.id)) + 1 : 1,
    nombre: req.body.nombre,
    edad: req.body.edad,
    tienePase: req.body.tienePase ?? false
  };

  visitantes.push(nuevoVisitante);
  res.status(201).json({ success: true, data: nuevoVisitante });
});

// PUT /visitantes/:id -> con validación Zod
app.put("/visitantes/:id", validate(updateVisitanteSchema), (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = visitantes.findIndex((v) => v.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: { message: "Visitante no encontrado", code: "NOT_FOUND" }
    });
  }

  const actual = visitantes[index]!;
  visitantes[index] = { ...actual, ...req.body };

  res.json({ success: true, data: visitantes[index] });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Ejercicio 01 (validación) corriendo en http://localhost:${PORT}`);
});