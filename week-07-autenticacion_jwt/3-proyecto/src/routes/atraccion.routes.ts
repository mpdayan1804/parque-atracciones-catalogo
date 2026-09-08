import { Router } from "express";
import { atraccionController } from "../controllers/atraccion.controller.js";
import { validate } from "../middlewares/validate.js";
import { createAtraccionSchema, updateAtraccionSchema } from "../schemas/atraccion.schema.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/", atraccionController.listar);
router.get("/:id", atraccionController.obtenerPorId);
router.post("/", requireAuth, validate(createAtraccionSchema), atraccionController.crear);
router.put("/:id", requireAuth, validate(updateAtraccionSchema), atraccionController.actualizar);
router.delete("/:id", requireAuth, atraccionController.eliminar);

export default router;
