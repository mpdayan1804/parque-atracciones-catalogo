import { Request, Response, NextFunction } from "express";
import { visitanteService } from "../services/visitante.service.js";

export const visitanteController = {
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const visitante = await visitanteService.crear(req.body);
      res.status(201).json({ success: true, data: visitante });
    } catch (err) {
      next(err);
    }
  },

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const visitantes = await visitanteService.listar();
      res.status(200).json({ success: true, data: visitantes, meta: { total: visitantes.length } });
    } catch (err) {
      next(err);
    }
  },

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const visitante = await visitanteService.obtenerPorId(id);
      res.status(200).json({ success: true, data: visitante });
    } catch (err) {
      next(err);
    }
  }
};
