import { Response, NextFunction } from "express";
import { AuthRequest } from "./requireAuth.js";
import { AppError } from "../errors/AppError.js";

export function requireRole(...rolesPermitidos: Array<"user" | "admin">) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      return next(AppError.unauthorized("No autenticado"));
    }

    if (!rolesPermitidos.includes(req.usuario.role as "user" | "admin")) {
      return next(AppError.forbidden("No tienes permisos para realizar esta accion"));
    }

    next();
  };
}
