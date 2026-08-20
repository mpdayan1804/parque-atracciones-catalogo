import { Request, Response, NextFunction } from "express";
import { atraccionService } from "../services/atraccion.service.js";

export const atraccionController = {
  listar(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoria } = req.query;
      const resultado = atraccionService.listar(categoria as string | undefined);

      res.status(200).json({
        success: true,
        data: resultado,
        meta: { total: resultado.length }
      });
    } catch (err) {
      next(err);
    }
  },

  obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const atraccion = atraccionService.obtenerPorId(id);

      res.status(200).json({ success: true, data: atraccion });
    } catch (err) {
      next(err);
    }
  },

  crear(req: Request, res: Response, next: NextFunction) {
    try {
      const nuevaAtraccion = atraccionService.crear(req.body);

      res.status(201).json({ success: true, data: nuevaAtraccion });
    } catch (err) {
      next(err);
    }
  },

  actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const actualizada = atraccionService.actualizar(id, req.body);

      res.status(200).json({ success: true, data: actualizada });
    } catch (err) {
      next(err);
    }
  },

  eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const eliminada = atraccionService.eliminar(id);

      res.status(200).json({ success: true, data: eliminada });
    } catch (err) {
      next(err);
    }
  }
};