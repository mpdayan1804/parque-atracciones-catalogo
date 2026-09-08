import { authRepository } from "../repositories/auth.repository.js";
import { generarAccessToken, generarRefreshToken, verificarRefreshToken } from "../utils/jwt.js";
import { AppError } from "../errors/AppError.js";
import type { RegisterInput, LoginInput } from "../schemas/auth.schema.js";

function emitirTokens(usuario: { id: string; email: string; refreshTokenVersion: number }) {
  const accessToken = generarAccessToken({ sub: usuario.id, email: usuario.email });
  const refreshToken = generarRefreshToken({ sub: usuario.id, tokenVersion: usuario.refreshTokenVersion });
  return { accessToken, refreshToken };
}

export const authService = {
  async registrar(datos: RegisterInput) {
    const yaExiste = await authRepository.existePorEmail(datos.email);
    if (yaExiste) {
      throw AppError.conflict("Ya existe una cuenta con ese email");
    }

    const usuario = await authRepository.crear(datos);
    const { accessToken, refreshToken } = emitirTokens(usuario);

    return {
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
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
  },

  async refrescar(refreshTokenCookie: string | undefined) {
    if (!refreshTokenCookie) {
      throw AppError.unauthorized("No se encontro un refresh token");
    }

    let payload;
    try {
      payload = verificarRefreshToken(refreshTokenCookie);
    } catch (error) {
      throw AppError.unauthorized("Refresh token invalido o expirado");
    }

    const usuario = await authRepository.buscarPorId(payload.sub);
    if (!usuario) {
      throw AppError.unauthorized("Usuario no encontrado");
    }

    if (payload.tokenVersion !== usuario.refreshTokenVersion) {
      throw AppError.unauthorized("El refresh token ya no es valido");
    }

    const usuarioActualizado = await authRepository.incrementarVersion(usuario.id);
    const { accessToken, refreshToken } = emitirTokens(usuarioActualizado!);

    return { accessToken, refreshToken };
  },

  async logout(id: string) {
    await authRepository.incrementarVersion(id);
  }
};
