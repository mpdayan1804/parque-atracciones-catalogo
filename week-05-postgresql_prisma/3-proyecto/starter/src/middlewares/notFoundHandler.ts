import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  const error = AppError.notFound(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  next(error);
}