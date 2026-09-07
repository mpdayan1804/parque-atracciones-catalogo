import { Request, Response, NextFunction } from "express";
import { AtraccionService } from "../services/AtraccionService.js";

const service = new AtraccionService();

export class AtraccionController {
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const atraccion = await service.crear(req.body);
      res.status(201).json({ success: true, data: atraccion });
    } catch (error) {
      next(error);
    }
  }

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const atracciones = await service.listar();
      res.status(200).json({ success: true, data: atracciones, meta: { total: atracciones.length } });
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const atraccion = await service.obtenerPorId(req.params.id as string);
      res.status(200).json({ success: true, data: atraccion });
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      await service.eliminar(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
