import express from "express";
import helmet from "helmet";
import cors from "cors";
import { corsOptions } from "./config/cors.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import visitanteRoutes from "./routes/visitante.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// 1. Helmet: cabeceras HTTP de seguridad (CSP, HSTS, X-Frame-Options, etc.)
app.use(helmet());

// 2. CORS: solo los origenes de la whitelist pueden hacer requests
app.use(cors(corsOptions));

// 3. Rate limiting general: aplica a toda la API
app.use(generalLimiter);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "API con Helmet + CORS + Rate Limiting - Ejercicio 02" });
});

app.use("/api/visitantes", visitanteRoutes);

app.use(errorHandler);

export default app;
