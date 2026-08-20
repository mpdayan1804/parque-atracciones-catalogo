import express from "express";
import morgan from "morgan";
import cors from "cors";
import atraccionRoutes from "./routes/atraccion.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import type { ApiErrorResponse } from "./types/apiResponse.js";

const app = express();

// Middlewares esenciales
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ mensaje: "API Parque de Atracciones — Arquitectura en capas 🎢" });
});

// Rutas de la API
app.use("/atracciones", atraccionRoutes);

// Middleware de ruta no encontrada (404)
app.use((req, res) => {
  const respuesta: ApiErrorResponse = {
    success: false,
    error: {
      message: "Ruta no encontrada",
      code: "ROUTE_NOT_FOUND"
    }
  };
  res.status(404).json(respuesta);
});

// Middleware de manejo de errores (siempre al final)
app.use(errorHandler);

export default app;