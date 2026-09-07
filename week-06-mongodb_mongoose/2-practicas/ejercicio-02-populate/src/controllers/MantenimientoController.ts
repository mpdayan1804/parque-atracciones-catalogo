import { Request, Response, NextFunction } from "express";
import { MantenimientoService } from "../services/MantenimientoService.js";

const service = new MantenimientoService();

export class MantenimientoController {
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const mantenimiento = await service.crear(req.body);
      res.status(201).json({ success: true, data: mantenimiento });
    } catch (error) {
      next(error);
    }
  }

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const mantenimientos = await service.listar();
      res.status(200).json({ success: true, data: mantenimientos, meta: { total: mantenimientos.length } });
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const mantenimiento = await service.obtenerPorId(req.params.id as string);
      res.status(200).json({ success: true, data: mantenimiento });
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const mantenimiento = await service.actualizar(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: mantenimiento });
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
