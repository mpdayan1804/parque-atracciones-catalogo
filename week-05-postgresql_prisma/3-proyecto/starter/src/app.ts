import express from "express";
import morgan from "morgan";
import cors from "cors";
import atraccionRoutes from "./routes/atraccion.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ mensaje: "API Parque de Atracciones — PostgreSQL + Prisma 🎢" });
});

app.use("/atracciones", atraccionRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;