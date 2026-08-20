import { Router } from "express";
import { visitanteController } from "../controllers/visitante.controller.js";

const router = Router();

router.get("/", visitanteController.listar);
router.get("/:id", visitanteController.obtenerPorId);
router.post("/", visitanteController.crear);
router.put("/:id", visitanteController.actualizar);
router.delete("/:id", visitanteController.eliminar);

export default router;