import { atraccionRepository } from "../repositories/atraccion.repository.js";
import type { CreateAtraccionInput, UpdateAtraccionInput } from "../schemas/atraccion.schema.js";
import { AppError } from "../errors/AppError.js";

export const atraccionService = {
  async listar(categoria?: string) {
    return atraccionRepository.findAll(categoria);
  },

  async obtenerPorId(id: string) {
    const atraccion = await atraccionRepository.findById(id);
    if (!atraccion) {
      throw AppError.notFound("Atraccion no encontrada");
    }
    return atraccion;
  },

  async crear(datos: CreateAtraccionInput) {
    return atraccionRepository.create({
      nombre: datos.nombre,
      categoria: datos.categoria,
      precio: datos.precio,
      capacidad: datos.capacidad,
      alturaMinima: datos.alturaMinima ?? 0,
      activa: datos.activa ?? true
    });
  },

  async actualizar(id: string, cambios: UpdateAtraccionInput) {
    const actualizada = await atraccionRepository.update(id, cambios);
    if (!actualizada) {
      throw AppError.notFound("Atraccion no encontrada");
    }
    return actualizada;
  },

  async eliminar(id: string) {
    const eliminada = await atraccionRepository.delete(id);
    if (!eliminada) {
      throw AppError.notFound("Atraccion no encontrada");
    }
    return eliminada;
  }
};
