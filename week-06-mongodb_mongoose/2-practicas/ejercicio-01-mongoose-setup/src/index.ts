import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "API funcionando" });
});

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
  });
}

start();
