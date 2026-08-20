import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { AppError } from "../errors/AppError.js";

export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
      const mensajes = resultado.error.issues.map((issue) => {
        const campo = issue.path.join(".");
        return `${campo}: ${issue.message}`;
      });

      const error = new AppError(mensajes.join(" | "), 400, "VALIDATION_ERROR");
      return next(error);
    }

    // Sobrescribimos req.body con los datos ya validados/parseados
    req.body = resultado.data;
    next();
  };
}