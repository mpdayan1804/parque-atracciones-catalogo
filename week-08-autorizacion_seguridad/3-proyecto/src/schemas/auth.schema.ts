import { z } from "zod";

// Sanitización básica para prevenir XSS
const sanitizeString = (val: string): string => {
  return val
    .replace(/[<>]/g, "") // Eliminar caracteres HTML peligrosos
    .trim();
};

export const registerSchema = z.object({
  nombre: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .transform(sanitizeString),
  email: z.string()
    .email("Email invalido")
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(8, "La contrasena debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contrasena debe contener al menos una mayuscula")
    .regex(/[0-9]/, "La contrasena debe contener al menos un numero")
    .regex(/[^A-Za-z0-9]/, "La contrasena debe contener al menos un caracter especial"),
  role: z.enum(["user", "admin"]).optional()
});

export const loginSchema = z.object({
  email: z.string()
    .email("Email invalido")
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(1, "La contrasena es obligatoria")
});

export const cambiarRolSchema = z.object({
  role: z.enum(["user", "admin"], {
    message: "Rol debe ser 'user' o 'admin'"
  })
});
