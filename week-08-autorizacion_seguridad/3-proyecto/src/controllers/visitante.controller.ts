import { Request, Response, NextFunction } from "express";
import { visitanteService } from "../services/visitante.service.js";

export class VisitanteController {
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const visitante = await visitanteService.crear(req.body);
      res.status(201).json({
        success: true,
        data: visitante
      });
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const visitante = await visitanteService.obtenerPorId(id as string);
      res.json({
        success: true,
        data: visitante
      });
    } catch (error) {
      next(error);
    }
  }

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const pagina = parseInt(req.query.pagina as string) || 1;
      const limite = parseInt(req.query.limite as string) || 10;

      const resultado = await visitanteService.listar(pagina, limite);
      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const visitante = await visitanteService.actualizar(id as string, req.body);
      res.json({
        success: true,
        data: visitante
      });
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const resultado = await visitanteService.eliminar(id as string);
      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  async listarPorFecha(req: Request, res: Response, next: NextFunction) {
    try {
      const { fecha } = req.params;
      const visitantes = await visitanteService.listarPorFecha(fecha as string);
      res.json({
        success: true,
        data: visitantes
      });
    } catch (error) {
      next(error);
    }
  }
}

export const visitanteController = new VisitanteController();
