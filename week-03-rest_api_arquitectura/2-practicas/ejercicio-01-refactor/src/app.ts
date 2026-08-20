import express from "express";
import visitanteRoutes from "./routes/visitante.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "Ejercicio 01 — Refactor en capas (visitantes)" });
});

app.use("/visitantes", visitanteRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: { message: "Ruta no encontrada", code: "ROUTE_NOT_FOUND" } });
});

app.use(errorHandler);

export default app;