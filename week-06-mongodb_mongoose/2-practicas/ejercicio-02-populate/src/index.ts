import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import atraccionRoutes from "./routes/atraccion.routes.js";
import mantenimientoRoutes from "./routes/mantenimiento.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "API funcionando" });
});

app.use("/api/atracciones", atraccionRoutes);
app.use("/api/mantenimientos", mantenimientoRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
  });
}

start();
