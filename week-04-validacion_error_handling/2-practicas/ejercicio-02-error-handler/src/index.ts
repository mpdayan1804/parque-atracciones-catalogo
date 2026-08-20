import express, { Request, Response, NextFunction } from "express";
import { AppError } from "./errors/AppError.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ mensaje: "Ejercicio 02 — AppError + Error Handler Global" });
});

// Simula un recurso que no existe -> AppError.notFound
app.get("/recurso/:id", (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);

  if (id !== 1) {
    return next(AppError.notFound(`Recurso con id ${id} no encontrado`));
  }

  res.json({ success: true, data: { id: 1, nombre: "Recurso de ejemplo" } });
});

// Simula una petición mal formada -> AppError.badRequest
app.post("/accion", (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.tipo) {
    return next(AppError.badRequest("El campo 'tipo' es obligatorio"));
  }

  res.status(201).json({ success: true, data: { tipo: req.body.tipo, procesado: true } });
});

// Simula un error no controlado (bug real) -> cae al 500 genérico
app.get("/forzar-error", (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new Error("Fallo inesperado simulado");
  } catch (err) {
    next(err);
  }
});

// 404 handler — después de todas las rutas
app.use(notFoundHandler);

// Error handler global — siempre al final
app.use(errorHandler);

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Ejercicio 02 (error handler) corriendo en http://localhost:${PORT}`);
});