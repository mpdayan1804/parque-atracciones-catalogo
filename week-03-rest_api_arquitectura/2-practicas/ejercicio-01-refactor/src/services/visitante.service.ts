import { visitanteRepository } from "../repositories/visitante.repository.js";
import type { Visitante } from "../types/visitante.js";

export class ServiceError extends Error {
  constructor(message: string, public statusCode: number, public code: string) {
    super(message);
  }
}

interface CreateVisitanteDTO {
  nombre: string;
  edad: number;
  tienePase?: boolean;
}

interface UpdateVisitanteDTO {
  nombre?: string;
  edad?: number;
  tienePase?: boolean;
}

export const visitanteService = {
  listar(): Visitante[] {
    return visitanteRepository.findAll();
  },

  obtenerPorId(id: number): Visitante {
    const visitante = visitanteRepository.findById(id);

    if (!visitante) {
      throw new ServiceError("Visitante no encontrado", 404, "NOT_FOUND");
    }

    return visitante;
  },

  crear(datos: CreateVisitanteDTO): Visitante {
    if (!datos.nombre || datos.edad === undefined) {
      throw new ServiceError("Faltan campos obligatorios: nombre, edad", 400, "VALIDATION_ERROR");
    }

    if (datos.edad < 0) {
      throw new ServiceError("La edad debe ser un valor positivo", 400, "VALIDATION_ERROR");
    }

    const nuevoVisitante: Visitante = {
      id: visitanteRepository.getNextId(),
      nombre: datos.nombre,
      edad: datos.edad,
      tienePase: datos.tienePase ?? false
    };

    return visitanteRepository.create(nuevoVisitante);
  },

  actualizar(id: number, cambios: UpdateVisitanteDTO): Visitante {
    this.obtenerPorId(id);

    if (cambios.edad !== undefined && cambios.edad < 0) {
      throw new ServiceError("La edad debe ser un valor positivo", 400, "VALIDATION_ERROR");
    }

    const actualizado = visitanteRepository.update(id, cambios);
    return actualizado!;
  },

  eliminar(id: number): Visitante {
    this.obtenerPorId(id);

    const eliminado = visitanteRepository.delete(id);
    return eliminado!;
  }
};