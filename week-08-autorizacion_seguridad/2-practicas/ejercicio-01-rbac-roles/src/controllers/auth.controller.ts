import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { AuthRequest } from "../middlewares/requireAuth.js";

const COOKIE_OPTS_ACCESS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 15 * 60 * 1000
};

const COOKIE_OPTS_REFRESH = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000
};

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie("accessToken", accessToken, COOKIE_OPTS_ACCESS);
  res.cookie("refreshToken", refreshToken, COOKIE_OPTS_REFRESH);
}

export const authController = {
  async registrar(req: Request, res: Response, next: NextFunction) {
    try {
      const { usuario, accessToken, refreshToken } = await authService.registrar(req.body);
      setAuthCookies(res, accessToken, refreshToken);
      res.status(201).json({ success: true, data: usuario });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { usuario, accessToken, refreshToken } = await authService.login(req.body);
      setAuthCookies(res, accessToken, refreshToken);
      res.status(200).json({ success: true, data: usuario });
    } catch (err) {
      next(err);
    }
  },

  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const perfil = await authService.obtenerPerfil(req.usuario!.id);
      res.status(200).json({ success: true, data: perfil });
    } catch (err) {
      next(err);
    }
  },

  async listarUsuarios(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarios = await authService.listarUsuarios();
      res.status(200).json({ success: true, data: usuarios, meta: { total: usuarios.length } });
    } catch (err) {
      next(err);
    }
  },

  async cambiarRol(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { role } = req.body;
      const usuario = await authService.cambiarRol(id, role);
      res.status(200).json({ success: true, data: usuario });
    } catch (err) {
      next(err);
    }
  }
};
