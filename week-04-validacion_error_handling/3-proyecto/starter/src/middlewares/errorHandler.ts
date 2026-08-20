import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";
import { logger } from "../config/logger.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Caso 1: error operacional conocido (AppError)
  if (err instanceof AppError) {
    logger.warn(`${err.code}: ${err.message} — ${req.method} ${req.originalUrl}`);

    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code
      }
    });
  }

  // Caso 2: error de validación de Zod que no pasó por el middleware `validate`
  // (por ejemplo, si se valida algo manualmente en un service)
  if (err instanceof ZodError) {
    const mensajes = err.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
    logger.warn(`VALIDATION_ERROR: ${mensajes.join(" | ")} — ${req.method} ${req.originalUrl}`);

    return res.status(400).json({
      success: false,
      error: {
        message: mensajes.join(" | "),
        code: "VALIDATION_ERROR"
      }
    });
  }

  // Caso 3: error inesperado, no controlado (bug real)
  logger.error(`Error no controlado: ${err.message}`, { stack: err.stack });

  res.status(500).json({
    success: false,
    error: {
      message: "Error interno del servidor",
      code: "INTERNAL_ERROR"
    }
  });
}