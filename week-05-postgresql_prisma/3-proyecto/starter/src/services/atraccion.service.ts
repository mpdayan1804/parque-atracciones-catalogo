import { atraccionRepository } from "../repositories/atraccion.repository.js";
import type { CreateAtraccionInput, UpdateAtraccionInput } from "../schemas/atraccion.schema.js";
import { AppError } from "../errors/AppError.js";

export const atraccionService = {
  async listar(categoria?: string) {
    return atraccionRepository.findAll(categoria);
  },

  async obtenerPorId(id: number) {
    const atraccion = await atraccionRepository.findById(id);

    if (!atraccion) {
      throw AppError.notFound("Atracción no encontrada");
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

  async actualizar(id: number, cambios: UpdateAtraccionInput) {
    // No verificamos existencia aquí; si no existe, Prisma lanza P2025
    // y lo traducimos a un 404 en el error handler
    return atraccionRepository.update(id, cambios);
  },

  async eliminar(id: number) {
    // Mismo caso: si no existe, Prisma lanza P2025
    return atraccionRepository.delete(id);
  }
};