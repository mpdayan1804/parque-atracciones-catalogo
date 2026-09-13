import { authRepository } from "../repositories/auth.repository.js";
import { generarAccessToken, generarRefreshToken } from "../utils/jwt.js";
import { AppError } from "../errors/AppError.js";
import type { RegisterInput, LoginInput } from "../schemas/auth.schema.js";

function emitirTokens(usuario: { id: string; email: string; role: "user" | "admin"; refreshTokenVersion: number }) {
  const accessToken = generarAccessToken({ sub: usuario.id, email: usuario.email, role: usuario.role });
  const refreshToken = generarRefreshToken({ sub: usuario.id, tokenVersion: usuario.refreshTokenVersion });
  return { accessToken, refreshToken };
}

export const authService = {
  async registrar(datos: RegisterInput) {
    const yaExiste = await authRepository.existePorEmail(datos.email);
    if (yaExiste) {
      throw AppError.conflict("Ya existe una cuenta con ese email");
    }

    // El rol SIEMPRE queda en "user" por defecto (definido en el modelo).
    // Nunca se acepta un "role" que venga del body del registro publico.
    const usuario = await authRepository.crear(datos);
    const { accessToken, refreshToken } = emitirTokens(usuario);

    return {
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, role: usuario.role },
      accessToken,
      refreshToken
    };
  },

  async login(credenciales: LoginInput) {
    const usuario = await authRepository.buscarPorEmailConPassword(credenciales.email);

    if (!usuario) {
      throw AppError.unauthorized("Credenciales invalidas");
    }

    const passwordValida = await usuario.compararPassword(credenciales.password);
    if (!passwordValida) {
      throw AppError.unauthorized("Credenciales invalidas");
    }

    const { accessToken, refreshToken } = emitirTokens(usuario);

    return {
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, role: usuario.role },
      accessToken,
      refreshToken
    };
  },

  async obtenerPerfil(id: string) {
    const usuario = await authRepository.buscarPorId(id);
    if (!usuario) {
      throw AppError.notFound("Usuario no encontrado");
    }
    return { id: usuario.id, nombre: usuario.nombre, email: usuario.email, role: usuario.role };
  },

  async listarUsuarios() {
    const usuarios = await authRepository.findAll();
    return usuarios.map((u) => ({ id: u.id, nombre: u.nombre, email: u.email, role: u.role }));
  },

  async cambiarRol(id: string, role: "user" | "admin") {
    const usuario = await authRepository.actualizarRol(id, role);
    if (!usuario) {
      throw AppError.notFound("Usuario no encontrado");
    }
    return { id: usuario.id, nombre: usuario.nombre, email: usuario.email, role: usuario.role };
  }
};
