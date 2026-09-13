import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { registerSchema, loginSchema, cambiarRolSchema } from "../schemas/auth.schema.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.registrar);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", requireAuth, authController.me);

// Rutas solo para admin
router.get("/users", requireAuth, requireRole("admin"), authController.listarUsuarios);
router.patch("/users/:id/role", requireAuth, requireRole("admin"), validate(cambiarRolSchema), authController.cambiarRol);

export default router;
