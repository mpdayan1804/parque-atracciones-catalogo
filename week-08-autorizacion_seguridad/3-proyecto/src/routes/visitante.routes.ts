import { Router } from "express";
import { visitanteController } from "../controllers/visitante.controller.js";
import { validate } from "../middlewares/validate.js";
import { crearVisitanteSchema, actualizarVisitanteSchema } from "../schemas/visitante.schema.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { strictLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

// Rutas públicas (lectura) - cualquier usuario autenticado puede ver
router.get("/", requireAuth, visitanteController.listar);
router.get("/fecha/:fecha", requireAuth, visitanteController.listarPorFecha);
router.get("/:id", requireAuth, visitanteController.obtenerPorId);

// Rutas de escritura - cualquier usuario autenticado puede crear
router.post("/", requireAuth, strictLimiter, validate(crearVisitanteSchema), visitanteController.crear);

// Rutas de modificación - solo admin
router.put("/:id", requireAuth, requireRole("admin"), validate(actualizarVisitanteSchema), visitanteController.actualizar);
router.patch("/:id", requireAuth, requireRole("admin"), validate(actualizarVisitanteSchema), visitanteController.actualizar);
router.delete("/:id", requireAuth, requireRole("admin"), visitanteController.eliminar);

export default router;
