import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppError } from "../errors/AppError.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    console.warn("[" + err.code + "] " + err.message + " - " + req.method + " " + req.originalUrl);
    return res.status(err.statusCode).json({
      success: false,
      error: { message: err.message, code: err.code }
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const mensajes = Object.values(err.errors).map((e) => e.message);
    console.warn("[VALIDATION_ERROR] " + mensajes.join(", ") + " - " + req.method + " " + req.originalUrl);
    return res.status(400).json({
      success: false,
      error: { message: mensajes.join(", "), code: "VALIDATION_ERROR" }
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    console.warn("[BAD_REQUEST] CastError en " + err.path + " - " + req.method + " " + req.originalUrl);
    return res.status(400).json({
      success: false,
      error: { message: "Id invalido: " + err.value, code: "BAD_REQUEST" }
    });
  }

  if ((err as any).code === 11000) {
    const campos = Object.keys((err as any).keyValue ?? {}).join(", ");
    console.warn("[CONFLICT] Duplicado en " + campos + " - " + req.method + " " + req.originalUrl);
    return res.status(409).json({
      success: false,
      error: { message: "Ya existe un registro con ese valor en: " + campos, code: "CONFLICT" }
    });
  }

  console.error("Error no controlado:", err);
  res.status(500).json({
    success: false,
    error: { message: "Error interno del servidor", code: "INTERNAL_ERROR" }
  });
}
