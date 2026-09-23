import { Request, Response } from 'express';
import { Usuario } from '../models/Usuario.js';

export class AuthController {
  async registrar(req: Request, res: Response) {
    try {
      const { nombre, email, password, role } = req.body;
      
      const usuario = new Usuario({ nombre, email, password, role });
      await usuario.save();
      
      const usuarioResponse = {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role
      };

      res.status(201).json({
        success: true,
        data: usuarioResponse
      });
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          error: { message: 'El email ya está registrado', code: 'CONFLICT' }
        });
      }
      
      res.status(500).json({
        success: false,
        error: { message: 'Error interno del servidor', code: 'INTERNAL_ERROR' }
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      const usuario = await Usuario.findOne({ email });
      
      if (!usuario) {
        return res.status(401).json({
          success: false,
          error: { message: 'Credenciales inválidas', code: 'UNAUTHORIZED' }
        });
      }

      if (usuario.password !== password) {
        return res.status(401).json({
          success: false,
          error: { message: 'Credenciales inválidas', code: 'UNAUTHORIZED' }
        });
      }

      const usuarioResponse = {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role
      };

      res.json({
        success: true,
        data: usuarioResponse
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { message: 'Error interno del servidor', code: 'INTERNAL_ERROR' }
      });
    }
  }

  async me(req: Request, res: Response) {
    try {
      const usuarioId = req.headers['user-id'] as string;
      
      const usuario = await Usuario.findById(usuarioId);
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          error: { message: 'Usuario no encontrado', code: 'NOT_FOUND' }
        });
      }

      const usuarioResponse = {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role
      };

      res.json({
        success: true,
        data: usuarioResponse
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { message: 'Error interno del servidor', code: 'INTERNAL_ERROR' }
      });
    }
  }
}

export const authController = new AuthController();
