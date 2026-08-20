import { Request, Response, NextFunction } from "express";
import { ServiceError } from "../services/atraccion.service.js";
import type { ApiErrorResponse } from "../types/apiResponse.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ServiceError) {
    const respuesta: ApiErrorResponse = {
      success: false,
      error: {
        message: err.message,
        code: err.code
      }
    };

    return res.status(err.statusCode).json(respuesta);
  }

  // Error inesperado, no controlado por el service
  console.error("Error no controlado:", err);

  const respuesta: ApiErrorResponse = {
    success: false,
    error: {
      message: "Error interno del servidor",
      code: "INTERNAL_ERROR"
    }
  };

  res.status(500).json(respuesta);
}