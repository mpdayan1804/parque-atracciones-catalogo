import { z } from "zod";

// Sanitización para prevenir XSS y NoSQL injection
const sanitizeString = (val: string): string => {
  return val
    .replace(/[<>]/g, "") // Eliminar caracteres HTML peligrosos
    .replace(/\$/g, "") // Eliminar operadores MongoDB
    .trim();
};

const sanitizeNumber = (val: any): number => {
  const num = Number(val);
  if (isNaN(num) || num < 0) {
    throw new Error("Valor numerico invalido");
  }
  return num;
};

export const crearAtraccionSchema = z.object({
  nombre: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .transform(sanitizeString),
  descripcion: z.string()
    .min(10, "La descripcion debe tener al menos 10 caracteres")
    .max(500, "La descripcion no puede exceder 500 caracteres")
    .transform(sanitizeString),
  categoria: z.enum(["acceso", "montana_rusa", "acuario", "espectaculo", "comida"], {
    message: "Categoria invalida"
  }),
  capacidad: z.number()
    .int("La capacidad debe ser un numero entero")
    .min(1, "La capacidad debe ser al menos 1")
    .max(1000, "La capacidad no puede exceder 1000")
    .transform(sanitizeNumber),
  altura_minima: z.number()
    .min(0, "La altura minima no puede ser negativa")
    .max(250, "La altura minima no puede exceder 250cm")
    .optional()
    .transform(sanitizeNumber),
  precio: z.number()
    .min(0, "El precio no puede ser negativo")
    .max(1000, "El precio no puede exceder 1000")
    .transform(sanitizeNumber),
  activa: z.boolean().optional()
});

export const actualizarAtraccionSchema = crearAtraccionSchema.partial();

export const filtrarAtraccionesSchema = z.object({
  categoria: z.enum(["acceso", "montana_rusa", "acuario", "espectaculo", "comida"]).optional(),
  activa: z.boolean().optional(),
  precio_max: z.number().min(0).optional().transform(sanitizeNumber),
  pagina: z.number().int().min(1).default(1).transform(sanitizeNumber),
  limite: z.number().int().min(1).max(100).default(10).transform(sanitizeNumber)
});
