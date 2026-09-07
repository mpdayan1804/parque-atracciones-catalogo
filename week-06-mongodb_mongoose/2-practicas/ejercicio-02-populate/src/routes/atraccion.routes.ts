import { Router } from "express";
import { AtraccionController } from "../controllers/AtraccionController.js";

const router = Router();
const controller = new AtraccionController();

router.post("/", (req, res, next) => controller.crear(req, res, next));
router.get("/", (req, res, next) => controller.listar(req, res, next));
router.get("/:id", (req, res, next) => controller.obtenerPorId(req, res, next));
router.delete("/:id", (req, res, next) => controller.eliminar(req, res, next));

export default router;
