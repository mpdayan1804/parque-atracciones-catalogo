import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../errors/AppError.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Caso 1: error operacional conocido (AppError)
  if (err instanceof AppError) {
    console.warn(`[${err.code}] ${err.message} — ${req.method} ${req.originalUrl}`);

    return res.status(err.statusCode).json({
      success: false,
      error: { message: err.message, code: err.code }
    });
  }

  // Caso 2: errores conocidos de Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2025: registro no encontrado (en update/delete)
    if (err.code === "P2025") {
      console.warn(`[NOT_FOUND] Prisma P2025 — ${req.method} ${req.originalUrl}`);

      return res.status(404).json({
        success: false,
        error: { message: "Registro no encontrado", code: "NOT_FOUND" }
      });
    }

    // P2002: violación de restricción única
    if (err.code === "P2002") {
      const campos = (err.meta?.target as string[])?.join(", ") ?? "campo";
      console.warn(`[CONFLICT] Prisma P2002 en ${campos} — ${req.method} ${req.originalUrl}`);

      return res.status(409).json({
        success: false,
        error: { message: `Ya existe un registro con ese valor en: ${campos}`, code: "CONFLICT" }
      });
    }

    // Otros errores conocidos de Prisma, no mapeados específicamente
    console.error(`Error de Prisma no mapeado (${err.code}):`, err.message);

    return res.status(400).json({
      success: false,
      error: { message: "Error al procesar la solicitud en la base de datos", code: "DATABASE_ERROR" }
    });
  }

  // Caso 3: error inesperado (bug real)
  console.error("Error no controlado:", err);

  res.status(500).json({
    success: false,
    error: { message: "Error interno del servidor", code: "INTERNAL_ERROR" }
  });
}