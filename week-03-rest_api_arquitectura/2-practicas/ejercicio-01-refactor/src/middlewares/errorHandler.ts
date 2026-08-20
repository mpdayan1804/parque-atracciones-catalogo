import { Request, Response, NextFunction } from "express";
import { ServiceError } from "../services/visitante.service.js";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ServiceError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { message: err.message, code: err.code }
    });
  }

  console.error("Error no controlado:", err);
  res.status(500).json({
    success: false,
    error: { message: "Error interno del servidor", code: "INTERNAL_ERROR" }
  });
}