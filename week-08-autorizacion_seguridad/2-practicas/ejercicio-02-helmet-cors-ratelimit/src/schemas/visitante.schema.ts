import { z } from "zod";

export const createVisitanteSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  edad: z.number().int().min(0).max(120),
  tienePase: z.boolean().optional()
});

export type CreateVisitanteInput = z.infer<typeof createVisitanteSchema>;
