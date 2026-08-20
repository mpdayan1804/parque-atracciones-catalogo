import { atraccionRepository } from "../repositories/atraccion.repository.js";
import type { Atraccion } from "../types/atraccion.js";
import type { CreateAtraccionDTO, UpdateAtraccionDTO } from "../dtos/atraccion.dto.js";

// Error personalizado para que el controller sepa qué status code usar
export class ServiceError extends Error {
  constructor(message: string, public statusCode: number, public code: string) {
    super(message);
  }
}

export const atraccionService = {
  listar(categoria?: string): Atraccion[] {
    if (categoria) {
      return atraccionRepository.findByCategoria(categoria);
    }
    return atraccionRepository.findAll();
  },

  obtenerPorId(id: number): Atraccion {
    const atraccion = atraccionRepository.findById(id);

    if (!atraccion) {
      throw new ServiceError("Atracción no encontrada", 404, "NOT_FOUND");
    }

    return atraccion;
  },

  crear(datos: CreateAtraccionDTO): Atraccion {
    if (!datos.nombre || !datos.categoria || datos.precio === undefined || datos.capacidad === undefined) {
      throw new ServiceError("Faltan campos obligatorios: nombre, categoria, precio, capacidad", 400, "VALIDATION_ERROR");
    }

    if (datos.precio < 0 || datos.capacidad < 0) {
      throw new ServiceError("El precio y la capacidad deben ser valores positivos", 400, "VALIDATION_ERROR");
    }

    const nuevaAtraccion: Atraccion = {
      id: atraccionRepository.getNextId(),
      nombre: datos.nombre,
      categoria: datos.categoria,
      precio: datos.precio,
      capacidad: datos.capacidad,
      alturaMinima: datos.alturaMinima ?? 0,
      activa: datos.activa ?? true
    };

    return atraccionRepository.create(nuevaAtraccion);
  },

  actualizar(id: number, cambios: UpdateAtraccionDTO): Atraccion {
    // Reutilizamos la validación de existencia
    this.obtenerPorId(id);

    if (cambios.precio !== undefined && cambios.precio < 0) {
      throw new ServiceError("El precio debe ser un valor positivo", 400, "VALIDATION_ERROR");
    }

    if (cambios.capacidad !== undefined && cambios.capacidad < 0) {
      throw new ServiceError("La capacidad debe ser un valor positivo", 400, "VALIDATION_ERROR");
    }

    const actualizada = atraccionRepository.update(id, cambios);
    return actualizada!;
  },

  eliminar(id: number): Atraccion {
    // Reutilizamos la validación de existencia
    this.obtenerPorId(id);

    const eliminada = atraccionRepository.delete(id);
    return eliminada!;
  }
};