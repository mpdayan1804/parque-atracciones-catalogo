import express from "express";
import morgan from "morgan";
import cors from "cors";
import atraccionRoutes from "./routes/atraccion.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { logger } from "./config/logger.js";

const app = express();

// Middlewares esenciales
app.use(cors());
app.use(express.json());

// Morgan registra cada petición HTTP, canalizado a través de Winston
app.use(
  morgan("dev", {
    stream: {
      write: (message: string) => logger.info(message.trim())
    }
  })
);

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ mensaje: "API Parque de Atracciones — Validación y manejo de errores 🎢" });
});

// Rutas de la API
app.use("/atracciones", atraccionRoutes);

// 404 handler — debe ir después de todas las rutas válidas
app.use(notFoundHandler);

// Error handler global — siempre al final
app.use(errorHandler);

export default app;