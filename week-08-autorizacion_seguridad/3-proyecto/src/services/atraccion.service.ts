import { atraccionRepository } from "../repositories/atraccion.repository.js";
import { AppError } from "../errors/AppError.js";

export class AtraccionService {
  async crear(datos: any) {
    const atraccion = await atraccionRepository.crear(datos);
    return atraccion;
  }

  async obtenerPorId(id: string) {
    const atraccion = await atraccionRepository.buscarPorId(id);
    if (!atraccion) {
      throw AppError.notFound("Atraccion no encontrada");
    }
    return atraccion;
  }

  async listar(filtros: any = {}) {
    const skip = (filtros.pagina - 1) * filtros.limite;
    const [atracciones, total] = await Promise.all([
      atraccionRepository.listar({
        ...filtros,
        skip,
        limit: filtros.limite
      }),
      atraccionRepository.contar({
        categoria: filtros.categoria,
        activa: filtros.activa,
        precio: filtros.precio_max ? { $lte: filtros.precio_max } : undefined
      })
    ]);

    return {
      atracciones,
      total,
      pagina: filtros.pagina,
      limite: filtros.limite,
      totalPaginas: Math.ceil(total / filtros.limite)
    };
  }

  async actualizar(id: string, datos: any) {
    const atraccion = await atraccionRepository.actualizar(id, datos);
    if (!atraccion) {
      throw AppError.notFound("Atraccion no encontrada");
    }
    return atraccion;
  }

  async eliminar(id: string) {
    const atraccion = await atraccionRepository.eliminar(id);
    if (!atraccion) {
      throw AppError.notFound("Atraccion no encontrada");
    }
    return { mensaje: "Atraccion eliminada correctamente" };
  }

  async buscarPorCategoria(categoria: string) {
    const atracciones = await atraccionRepository.buscarPorCategoria(categoria as any);
    return atracciones;
  }
}

export const atraccionService = new AtraccionService();
