import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { AppError } from "../errors/AppError.js";

export function validate(schema: ZodType, target: "body" | "query" = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = target === "body" ? req.body : req.query;
    const resultado = schema.safeParse(data);
    if (!resultado.success) {
      const mensajes = resultado.error.issues.map((issue) => {
        const campo = issue.path.join(".");
        return campo + ": " + issue.message;
      });
      const error = new AppError(mensajes.join(" | "), 400, "VALIDATION_ERROR");
      return next(error);
    }
    if (target === "body") {
      req.body = resultado.data;
    } else {
      req.query = resultado.data as any;
    }
    next();
  };
}
