import { Request, Response, NextFunction } from "express";
import { VisitanteService } from "../services/VisitanteService.js";

const service = new VisitanteService();

export class VisitanteController {
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const visitante = await service.crear(req.body);
      res.status(201).json({ success: true, data: visitante });
    } catch (error) {
      next(error);
    }
  }

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const visitantes = await service.listar();
      res.status(200).json({ success: true, data: visitantes, meta: { total: visitantes.length } });
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const visitante = await service.obtenerPorId(req.params.id as string);
      res.status(200).json({ success: true, data: visitante });
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const visitante = await service.actualizar(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: visitante });
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
