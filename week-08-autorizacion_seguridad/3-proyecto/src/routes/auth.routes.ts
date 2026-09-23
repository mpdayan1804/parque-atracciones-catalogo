import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { registerSchema, loginSchema, cambiarRolSchema } from "../schemas/auth.schema.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { strictLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

// Rutas públicas con rate limiting estricto
router.post("/register", strictLimiter, validate(registerSchema), authController.registrar);
router.post("/login", strictLimiter, validate(loginSchema), authController.login);

// Rutas protegidas (requieren autenticación)
router.get("/me", requireAuth, authController.me);
router.post("/logout", requireAuth, authController.logout);

// Rutas solo para admin
router.get("/users", requireAuth, requireRole("admin"), authController.listarUsuarios);
router.patch("/users/:id/role", requireAuth, requireRole("admin"), validate(cambiarRolSchema), authController.cambiarRol);

export default router;
