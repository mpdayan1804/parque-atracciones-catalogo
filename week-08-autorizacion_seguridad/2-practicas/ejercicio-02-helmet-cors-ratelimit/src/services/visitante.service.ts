import { visitanteRepository } from "../repositories/visitante.repository.js";
import type { CreateVisitanteInput } from "../schemas/visitante.schema.js";
import { AppError } from "../errors/AppError.js";

export const visitanteService = {
  async crear(datos: CreateVisitanteInput) {
    return visitanteRepository.create(datos);
  },

  async listar() {
    return visitanteRepository.findAll();
  },

  async obtenerPorId(id: string) {
    const visitante = await visitanteRepository.findById(id);
    if (!visitante) {
      throw AppError.notFound("Visitante no encontrado");
    }
    return visitante;
  }
};
