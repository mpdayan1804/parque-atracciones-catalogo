import { Request, Response, NextFunction } from "express";
import { visitanteService } from "../services/visitante.service.js";

export const visitanteController = {
  listar(req: Request, res: Response, next: NextFunction) {
    try {
      const resultado = visitanteService.listar();
      res.status(200).json({ success: true, data: resultado, meta: { total: resultado.length } });
    } catch (err) {
      next(err);
    }
  },

  obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const visitante = visitanteService.obtenerPorId(id);
      res.status(200).json({ success: true, data: visitante });
    } catch (err) {
      next(err);
    }
  },

  crear(req: Request, res: Response, next: NextFunction) {
    try {
      const nuevo = visitanteService.crear(req.body);
      res.status(201).json({ success: true, data: nuevo });
    } catch (err) {
      next(err);
    }
  },

  actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const actualizado = visitanteService.actualizar(id, req.body);
      res.status(200).json({ success: true, data: actualizado });
    } catch (err) {
      next(err);
    }
  },

  eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const eliminado = visitanteService.eliminar(id);
      res.status(200).json({ success: true, data: eliminado });
    } catch (err) {
      next(err);
    }
  }
};