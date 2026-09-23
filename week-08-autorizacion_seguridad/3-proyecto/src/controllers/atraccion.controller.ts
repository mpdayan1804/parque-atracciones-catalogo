import { Request, Response, NextFunction } from "express";
import { atraccionService } from "../services/atraccion.service.js";

export class AtraccionController {
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const atraccion = await atraccionService.crear(req.body);
      res.status(201).json({
        success: true,
        data: atraccion
      });
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const atraccion = await atraccionService.obtenerPorId(id as string);
      res.json({
        success: true,
        data: atraccion
      });
    } catch (error) {
      next(error);
    }
  }

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const filtros = {
        categoria: req.query.categoria,
        activa: req.query.activa === "true" ? true : req.query.activa === "false" ? false : undefined,
        precio_max: req.query.precio_max ? Number(req.query.precio_max) : undefined,
        pagina: parseInt(req.query.pagina as string) || 1,
        limite: parseInt(req.query.limite as string) || 10
      };

      const resultado = await atraccionService.listar(filtros);
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
      const atraccion = await atraccionService.actualizar(id as string, req.body);
      res.json({
        success: true,
        data: atraccion
      });
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const resultado = await atraccionService.eliminar(id as string);
      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  async buscarPorCategoria(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoria } = req.params;
      const atracciones = await atraccionService.buscarPorCategoria(categoria as string);
      res.json({
        success: true,
        data: atracciones
      });
    } catch (error) {
      next(error);
    }
  }
}

export const atraccionController = new AtraccionController();
