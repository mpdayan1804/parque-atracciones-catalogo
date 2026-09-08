import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ mensaje: "API Autenticacion JWT - Ejercicio 02 (refresh tokens)" });
});

app.use("/auth", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
  });
}

start();
