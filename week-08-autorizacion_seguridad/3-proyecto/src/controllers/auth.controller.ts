import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { AuthRequest } from "../middlewares/requireAuth.js";

export class AuthController {
  async registrar(req: Request, res: Response, next: NextFunction) {
    try {
      const resultado = await authService.registrar(req.body);
      
      res.cookie("token", resultado.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000 // 1 hora
      });

      res.status(201).json({
        success: true,
        data: resultado.usuario
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const resultado = await authService.login(req.body);
      
      res.cookie("token", resultado.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000 // 1 hora
      });

      res.json({
        success: true,
        data: resultado.usuario
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.usuario) {
        throw new Error("No autenticado");
      }

      const usuario = await authService.obtenerUsuario(req.usuario.id);
      res.json({
        success: true,
        data: usuario
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("token");
    res.json({
      success: true,
      message: "Sesion cerrada correctamente"
    });
  }

  async listarUsuarios(req: Request, res: Response, next: NextFunction) {
    try {
      const pagina = parseInt(req.query.pagina as string) || 1;
      const limite = parseInt(req.query.limite as string) || 10;

      const resultado = await authService.listarUsuarios(pagina, limite);
      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  async cambiarRol(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const resultado = await authService.cambiarRol(id as string, role);
      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
