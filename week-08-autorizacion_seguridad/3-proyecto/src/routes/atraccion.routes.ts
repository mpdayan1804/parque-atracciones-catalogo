import { Router } from "express";
import { atraccionController } from "../controllers/atraccion.controller.js";
import { validate } from "../middlewares/validate.js";
import { crearAtraccionSchema, actualizarAtraccionSchema, filtrarAtraccionesSchema } from "../schemas/atraccion.schema.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { strictLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

// Rutas públicas (lectura) - cualquier usuario autenticado puede ver
router.get("/", requireAuth, validate(filtrarAtraccionesSchema, "query"), atraccionController.listar);
router.get("/categoria/:categoria", requireAuth, atraccionController.buscarPorCategoria);
router.get("/:id", requireAuth, atraccionController.obtenerPorId);

// Rutas de escritura - solo admin
router.post("/", requireAuth, requireRole("admin"), strictLimiter, validate(crearAtraccionSchema), atraccionController.crear);
router.put("/:id", requireAuth, requireRole("admin"), validate(actualizarAtraccionSchema), atraccionController.actualizar);
router.patch("/:id", requireAuth, requireRole("admin"), validate(actualizarAtraccionSchema), atraccionController.actualizar);
router.delete("/:id", requireAuth, requireRole("admin"), atraccionController.eliminar);

export default router;
