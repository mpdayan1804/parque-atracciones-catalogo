import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../errors/AppError.js";
import { Usuario } from "../models/Usuario.js";

export interface AuthRequest extends Request {
  usuario?: {
    id: string;
    email: string;
    role: string;
  };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    return next(AppError.unauthorized("No proporcionaste token de autenticacion"));
  }

  try {
    const decoded = verifyToken(token);
    req.usuario = decoded;
    next();
  } catch (error) {
    return next(AppError.unauthorized("Token invalido o expirado"));
  }
}
