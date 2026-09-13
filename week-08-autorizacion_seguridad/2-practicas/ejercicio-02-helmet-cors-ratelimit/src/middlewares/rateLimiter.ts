import rateLimit from "express-rate-limit";

// Limitador general: aplica a toda la API
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Demasiadas solicitudes, intenta de nuevo mas tarde",
      code: "TOO_MANY_REQUESTS"
    }
  }
});

// Limitador estricto: para endpoints sensibles (ej: creacion de recursos)
export const strictLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Limite de solicitudes excedido para esta accion, espera unos minutos",
      code: "TOO_MANY_REQUESTS"
    }
  }
});
