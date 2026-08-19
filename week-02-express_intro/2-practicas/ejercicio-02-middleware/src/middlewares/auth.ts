import { Request, Response, NextFunction } from "express";

const API_KEY_VALIDA = "parque-secreto-123";

export function auth(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ error: "Falta el header x-api-key" });
  }

  if (apiKey !== API_KEY_VALIDA) {
    return res.status(403).json({ error: "API key inválida" });
  }

  next();
}