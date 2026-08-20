import { Router } from "express";
import { atraccionController } from "../controllers/atraccion.controller.js";

const router = Router();

router.get("/", atraccionController.listar);
router.get("/:id", atraccionController.obtenerPorId);
router.post("/", atraccionController.crear);
router.put("/:id", atraccionController.actualizar);
router.delete("/:id", atraccionController.eliminar);

export default router;