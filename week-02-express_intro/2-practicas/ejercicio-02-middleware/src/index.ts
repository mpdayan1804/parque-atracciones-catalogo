import express, { Request, Response, NextFunction } from "express";
import { logger } from "./middlewares/logger.js";
import { auth } from "./middlewares/auth.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());

// Middleware global: se ejecuta en TODAS las rutas
app.use(logger);

// Ruta pública, no requiere auth
app.get("/", (req: Request, res: Response) => {
  res.json({ mensaje: "Ruta pública, no necesita autenticación" });
});

// Ruta protegida: aquí aplicamos el middleware de auth SOLO a esta ruta
app.get("/privado", auth, (req: Request, res: Response) => {
  res.json({ mensaje: "Accediste a la ruta protegida correctamente" });
});

// Ruta de prueba para forzar un error y ver el errorHandler en acción
app.get("/error", (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new Error("Error simulado para probar el middleware de errores");
  } catch (err) {
    next(err);
  }
});

// Middleware de 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware de errores (siempre al final)
app.use(errorHandler);

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Ejercicio 02 corriendo en http://localhost:${PORT}`);
});