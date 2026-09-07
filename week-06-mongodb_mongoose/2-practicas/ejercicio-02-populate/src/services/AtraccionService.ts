import { AtraccionRepository } from "../repositories/AtraccionRepository.js";
import { IAtraccion } from "../models/Atraccion.js";
import { AppError } from "../errors/AppError.js";
import { Mantenimiento } from "../models/Mantenimiento.js";

const repository = new AtraccionRepository();

export class AtraccionService {
  async crear(data: Partial<IAtraccion>): Promise<IAtraccion> {
    return repository.create(data);
  }

  async listar(): Promise<IAtraccion[]> {
    return repository.findAll();
  }

  async obtenerPorId(id: string): Promise<IAtraccion> {
    const atraccion = await repository.findById(id);
    if (!atraccion) {
      throw AppError.notFound("Atraccion no encontrada");
    }
    return atraccion;
  }

  async eliminar(id: string): Promise<void> {
    const atraccion = await repository.findById(id);
    if (!atraccion) {
      throw AppError.notFound("Atraccion no encontrada");
    }
    await Mantenimiento.deleteMany({ atraccion: id });
    await repository.delete(id);
  }
}
