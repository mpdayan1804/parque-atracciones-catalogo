import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { corsOptions } from "./config/cors.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import atraccionRoutes from "./routes/atraccion.routes.js";
import visitanteRoutes from "./routes/visitante.routes.js";

const app = express();

// 1. Helmet: cabeceras HTTP de seguridad (CSP, HSTS, X-Frame-Options, etc.)
app.use(helmet());

// 2. CORS: solo los origenes de la whitelist pueden hacer requests
app.use(cors(corsOptions));

// 3. Rate limiting general: aplica a toda la API
app.use(generalLimiter);

// 4. Logging
app.use(morgan("dev"));

// 5. Body parsers
app.use(express.json());
app.use(cookieParser());

// 6. Rutas
app.get("/", (req, res) => {
  res.json({ 
    mensaje: "API del Parque de Atracciones - Semana 8: Autorización y Seguridad",
    version: "1.0.0",
    features: [
      "RBAC (Role-Based Access Control)",
      "Helmet para cabeceras de seguridad",
      "CORS configurado",
      "Rate Limiting",
      "Sanitización de inputs"
    ],
    endpoints: {
      auth: "/auth",
      atracciones: "/api/atracciones",
      visitantes: "/api/visitantes"
    }
  });
});

app.use("/auth", authRoutes);
app.use("/api/atracciones", atraccionRoutes);
app.use("/api/visitantes", visitanteRoutes);

// 7. Manejo de rutas no encontradas
app.use(notFoundHandler);

// 8. Middleware global de errores
app.use(errorHandler);

export default app;
