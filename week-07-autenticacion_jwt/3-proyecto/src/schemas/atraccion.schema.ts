import { z } from "zod";

export const categoriaEnum = z.enum(["mecanica", "acuatica", "infantil", "extrema", "familiar"]);

export const createAtraccionSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  categoria: categoriaEnum,
  precio: z.number().positive("El precio debe ser un valor positivo"),
  capacidad: z.number().int().positive("La capacidad debe ser un entero positivo"),
  alturaMinima: z.number().min(0, "La altura minima no puede ser negativa").optional(),
  activa: z.boolean().optional()
});

export const updateAtraccionSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
  categoria: categoriaEnum.optional(),
  precio: z.number().positive("El precio debe ser un valor positivo").optional(),
  capacidad: z.number().int().positive("La capacidad debe ser un entero positivo").optional(),
  alturaMinima: z.number().min(0, "La altura minima no puede ser negativa").optional(),
  activa: z.boolean().optional()
});

export type CreateAtraccionInput = z.infer<typeof createAtraccionSchema>;
export type UpdateAtraccionInput = z.infer<typeof updateAtraccionSchema>;
