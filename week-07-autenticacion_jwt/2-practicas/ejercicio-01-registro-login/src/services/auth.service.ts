import { authRepository } from "../repositories/auth.repository.js";
import { generarAccessToken, generarRefreshToken } from "../utils/jwt.js";
import { AppError } from "../errors/AppError.js";
import type { RegisterInput, LoginInput } from "../schemas/auth.schema.js";

export const authService = {
  async registrar(datos: RegisterInput) {
    const yaExiste = await authRepository.existePorEmail(datos.email);
    if (yaExiste) {
      throw AppError.conflict("Ya existe una cuenta con ese email");
    }

    const usuario = await authRepository.crear(datos);

    const accessToken = generarAccessToken({ sub: usuario.id, email: usuario.email });
    const refreshToken = generarRefreshToken({ sub: usuario.id, email: usuario.email });

    return {
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
      accessToken,
      refreshToken
    };
  },

  async login(credenciales: LoginInput) {
    const usuario = await authRepository.buscarPorEmailConPassword(credenciales.email);

    // Mensaje generico a proposito: no revelamos si fue el email o la contrasena
    // lo que fallo (prevencion de user enumeration)
    if (!usuario) {
      throw AppError.unauthorized("Credenciales invalidas");
    }

    const passwordValida = await usuario.compararPassword(credenciales.password);
    if (!passwordValida) {
      throw AppError.unauthorized("Credenciales invalidas");
    }

    const accessToken = generarAccessToken({ sub: usuario.id, email: usuario.email });
    const refreshToken = generarRefreshToken({ sub: usuario.id, email: usuario.email });

    return {
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
      accessToken,
      refreshToken
    };
  },

  async obtenerPerfil(id: string) {
    const usuario = await authRepository.buscarPorId(id);
    if (!usuario) {
      throw AppError.notFound("Usuario no encontrado");
    }
    return { id: usuario.id, nombre: usuario.nombre, email: usuario.email };
  }
};
