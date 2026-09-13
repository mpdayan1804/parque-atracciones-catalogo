import { Router } from "express";
import { visitanteController } from "../controllers/visitante.controller.js";
import { validate } from "../middlewares/validate.js";
import { createVisitanteSchema } from "../schemas/visitante.schema.js";
import { strictLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

router.get("/", visitanteController.listar);
router.get("/:id", visitanteController.obtenerPorId);
router.post("/", strictLimiter, validate(createVisitanteSchema), visitanteController.crear);

export default router;
