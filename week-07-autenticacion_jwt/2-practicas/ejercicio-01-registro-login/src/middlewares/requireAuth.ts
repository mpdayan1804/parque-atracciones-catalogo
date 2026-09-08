import { Request, Response, NextFunction } from "express";
import { verificarAccessToken } from "../utils/jwt.js";
import { AppError } from "../errors/AppError.js";

export interface AuthRequest extends Request {
  usuario?: { id: string; email: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken;

  if (!token) {
    return next(AppError.unauthorized("No se encontro un token de acceso"));
  }

  try {
    const payload = verificarAccessToken(token);
    req.usuario = { id: payload.sub, email: payload.email };
    next();
  } catch (error) {
    return next(AppError.unauthorized("Token invalido o expirado"));
  }
}
