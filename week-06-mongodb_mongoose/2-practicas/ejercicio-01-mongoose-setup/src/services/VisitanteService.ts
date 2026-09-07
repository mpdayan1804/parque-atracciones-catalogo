import { VisitanteRepository } from "../repositories/VisitanteRepository.js";
import { IVisitante } from "../models/Visitante.js";
import { AppError } from "../errors/AppError.js";

const repository = new VisitanteRepository();

export class VisitanteService {
  async crear(data: Partial<IVisitante>): Promise<IVisitante> {
    return repository.create(data);
  }

  async listar(): Promise<IVisitante[]> {
    return repository.findAll();
  }

  async obtenerPorId(id: string): Promise<IVisitante> {
    const visitante = await repository.findById(id);
    if (!visitante) {
      throw AppError.notFound("Visitante no encontrado");
    }
    return visitante;
  }

  async actualizar(id: string, data: Partial<IVisitante>): Promise<IVisitante> {
    const visitante = await repository.update(id, data);
    if (!visitante) {
      throw AppError.notFound("Visitante no encontrado");
    }
    return visitante;
  }

  async eliminar(id: string): Promise<void> {
    const visitante = await repository.delete(id);
    if (!visitante) {
      throw AppError.notFound("Visitante no encontrado");
    }
  }
}
