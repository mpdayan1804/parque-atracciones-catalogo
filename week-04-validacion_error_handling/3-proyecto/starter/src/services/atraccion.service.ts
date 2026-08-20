import { atraccionRepository } from "../repositories/atraccion.repository.js";
import type { Atraccion } from "../types/atraccion.js";
import type { CreateAtraccionInput, UpdateAtraccionInput } from "../schemas/atraccion.schema.js";
import { AppError } from "../errors/AppError.js";

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
      throw AppError.notFound("Atracción no encontrada");
    }

    return atraccion;
  },

  crear(datos: CreateAtraccionInput): Atraccion {
    // Los datos ya vienen validados por Zod (middleware `validate`) — el service
    // solo se preocupa de construir la entidad y guardarla
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

  actualizar(id: number, cambios: UpdateAtraccionInput): Atraccion {
    this.obtenerPorId(id); // valida que exista, o lanza AppError.notFound

    const actualizada = atraccionRepository.update(id, cambios);
    return actualizada!;
  },

  eliminar(id: number): Atraccion {
    this.obtenerPorId(id);

    const eliminada = atraccionRepository.delete(id);
    return eliminada!;
  }
};