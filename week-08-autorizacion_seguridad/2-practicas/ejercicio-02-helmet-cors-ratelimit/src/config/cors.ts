import { CorsOptions } from "cors";

const origenesPermitidos = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origen) => origen.trim())
  .filter(Boolean);

export const corsOptions: CorsOptions = {
  origin(origen, callback) {
    // Permite requests sin "origin" (Postman, curl, apps moviles, servidor a servidor)
    if (!origen) {
      return callback(null, true);
    }

    if (origenesPermitidos.includes(origen)) {
      return callback(null, true);
    }

    callback(new Error("Origen no permitido por CORS: " + origen));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
