import { Router } from "express";
import { atraccionController } from "../controllers/atraccion.controller.js";
import { validate } from "../middlewares/validate.js";
import { createAtraccionSchema, updateAtraccionSchema } from "../schemas/atraccion.schema.js";

const router = Router();

router.get("/", atraccionController.listar);
router.get("/:id", atraccionController.obtenerPorId);
router.post("/", validate(createAtraccionSchema), atraccionController.crear);
router.put("/:id", validate(updateAtraccionSchema), atraccionController.actualizar);
router.delete("/:id", atraccionController.eliminar);

export default router;
