import { Request, Response, NextFunction } from "express";
import { atraccionService } from "../services/atraccion.service.js";

export const atraccionController = {
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoria } = req.query;
      const resultado = await atraccionService.listar(categoria as string | undefined);
      res.status(200).json({
        success: true,
        data: resultado,
        meta: { total: resultado.length }
      });
    } catch (err) {
      next(err);
    }
  },

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const atraccion = await atraccionService.obtenerPorId(id);
      res.status(200).json({ success: true, data: atraccion });
    } catch (err) {
      next(err);
    }
  },

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const nuevaAtraccion = await atraccionService.crear(req.body);
      res.status(201).json({ success: true, data: nuevaAtraccion });
    } catch (err) {
      next(err);
    }
  },

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const actualizada = await atraccionService.actualizar(id, req.body);
      res.status(200).json({ success: true, data: actualizada });
    } catch (err) {
      next(err);
    }
  },

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const eliminada = await atraccionService.eliminar(id);
      res.status(200).json({ success: true, data: eliminada });
    } catch (err) {
      next(err);
    }
  }
};
