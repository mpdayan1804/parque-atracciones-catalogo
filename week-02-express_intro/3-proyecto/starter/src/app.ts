import express from "express";
import morgan from "morgan";
import cors from "cors";
import atraccionesRouter from "./routes/atracciones.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Middlewares esenciales
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rutas
app.get("/", (req, res) => {
  res.json({ mensaje: "API Parque de Atracciones funcionando 🎢" });
});

app.use("/atracciones", atraccionesRouter);

// Middleware de ruta no encontrada (404)
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware de manejo de errores
app.use(errorHandler);

export default app;