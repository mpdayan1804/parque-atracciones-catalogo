import { Request, Response, NextFunction } from "express";
import { atraccionService, ServiceError } from "../services/atraccion.service.js";
import type { ApiSuccessResponse, ApiErrorResponse } from "../types/apiResponse.js";
import type { Atraccion } from "../types/atraccion.js";

export const atraccionController = {
  listar(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoria } = req.query;
      const resultado = atraccionService.listar(categoria as string | undefined);

      const respuesta: ApiSuccessResponse<Atraccion[]> = {
        success: true,
        data: resultado,
        meta: { total: resultado.length }
      };

      res.status(200).json(respuesta);
    } catch (err) {
      next(err);
    }
  },

  obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const atraccion = atraccionService.obtenerPorId(id);

      const respuesta: ApiSuccessResponse<Atraccion> = {
        success: true,
        data: atraccion
      };

      res.status(200).json(respuesta);
    } catch (err) {
      next(err);
    }
  },

  crear(req: Request, res: Response, next: NextFunction) {
    try {
      const nuevaAtraccion = atraccionService.crear(req.body);

      const respuesta: ApiSuccessResponse<Atraccion> = {
        success: true,
        data: nuevaAtraccion
      };

      res.status(201).json(respuesta);
    } catch (err) {
      next(err);
    }
  },

  actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const actualizada = atraccionService.actualizar(id, req.body);

      const respuesta: ApiSuccessResponse<Atraccion> = {
        success: true,
        data: actualizada
      };

      res.status(200).json(respuesta);
    } catch (err) {
      next(err);
    }
  },

  eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const eliminada = atraccionService.eliminar(id);

      const respuesta: ApiSuccessResponse<Atraccion> = {
        success: true,
        data: eliminada
      };

      res.status(200).json(respuesta);
    } catch (err) {
      next(err);
    }
  }
};