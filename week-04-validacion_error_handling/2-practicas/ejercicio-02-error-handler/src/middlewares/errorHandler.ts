import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    console.warn(`[${err.code}] ${err.message} — ${req.method} ${req.originalUrl}`);

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