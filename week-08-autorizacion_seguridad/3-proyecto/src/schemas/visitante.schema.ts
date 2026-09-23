import { z } from "zod";

const sanitizeString = (val: string | undefined): string => {
  if (!val) return "";
  return val
    .replace(/[<>]/g, "")
    .replace(/\$/g, "")
    .trim();
};

export const crearVisitanteSchema = z.object({
  nombre: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .transform(sanitizeString),
  email: z.string()
    .email("Email invalido")
    .toLowerCase()
    .trim(),
  telefono: z.string()
    .regex(/^\d{10}$/, "El telefono debe tener 10 digitos")
    .optional()
    .transform(sanitizeString),
  fecha_visita: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha invalido, usa YYYY-MM-DD")
});

export const actualizarVisitanteSchema = crearVisitanteSchema.partial();
