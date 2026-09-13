import { z } from "zod";

export const registerSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("El email no es valido"),
  password: z.string().min(8, "La contrasena debe tener al menos 8 caracteres")
});

export const loginSchema = z.object({
  email: z.string().email("El email no es valido"),
  password: z.string().min(1, "La contrasena es obligatoria")
});

export const cambiarRolSchema = z.object({
  role: z.enum(["user", "admin"], { message: "El rol debe ser user o admin" })
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CambiarRolInput = z.infer<typeof cambiarRolSchema>;
