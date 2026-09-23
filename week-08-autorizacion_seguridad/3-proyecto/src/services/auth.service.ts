import { usuarioRepository } from "../repositories/usuario.repository.js";
import { Usuario } from "../models/Usuario.js";
import type { Rol } from "../models/Usuario.js";
import { generateToken } from "../utils/jwt.js";
import { AppError } from "../errors/AppError.js";

export class AuthService {
  async registrar(datos: {
    nombre: string;
    email: string;
    password: string;
    role?: Rol;
  }) {
    const existeUsuario = await usuarioRepository.buscarPorEmail(datos.email);
    if (existeUsuario) {
      throw AppError.badRequest("El email ya esta registrado");
    }

    const usuario = await usuarioRepository.crear(datos);
    
    const token = generateToken({
      id: usuario._id.toString(),
      email: usuario.email,
      role: usuario.role
    });

    return {
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role
      },
      token
    };
  }

  async login(datos: { email: string; password: string }) {
    const usuario = await usuarioRepository.buscarPorEmail(datos.email);
    
    if (!usuario) {
      throw AppError.unauthorized("Credenciales invalidas");
    }

    const passwordValida = await usuario.compararPassword(datos.password);
    if (!passwordValida) {
      throw AppError.unauthorized("Credenciales invalidas");
    }

    const token = generateToken({
      id: usuario._id.toString(),
      email: usuario.email,
      role: usuario.role
    });

    return {
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role
      },
      token
    };
  }

  async obtenerUsuario(id: string) {
    const usuario = await usuarioRepository.buscarPorId(id);
    if (!usuario) {
      throw AppError.notFound("Usuario no encontrado");
    }

    return {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      role: usuario.role,
      createdAt: usuario.createdAt
    };
  }

  async listarUsuarios(pagina: number = 1, limite: number = 10) {
    const skip = (pagina - 1) * limite;
    const [usuarios, total] = await Promise.all([
      usuarioRepository.listar(skip, limite),
      usuarioRepository.contar()
    ]);

    return {
      usuarios: usuarios.map(u => ({
        id: u._id,
        nombre: u.nombre,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt
      })),
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite)
    };
  }

  async cambiarRol(id: string, nuevoRol: Rol) {
    const usuario = await usuarioRepository.actualizar(id, { role: nuevoRol });
    if (!usuario) {
      throw AppError.notFound("Usuario no encontrado");
    }

    return {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      role: usuario.role
    };
  }
}

export const authService = new AuthService();
