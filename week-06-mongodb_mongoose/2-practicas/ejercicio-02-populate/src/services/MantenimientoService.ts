import { MantenimientoRepository } from "../repositories/MantenimientoRepository.js";
import { IMantenimiento } from "../models/Mantenimiento.js";
import { Atraccion } from "../models/Atraccion.js";
import { AppError } from "../errors/AppError.js";

const repository = new MantenimientoRepository();

export class MantenimientoService {
  async crear(data: Partial<IMantenimiento>): Promise<IMantenimiento> {
    const atraccion = await Atraccion.findById(data.atraccion);
    if (!atraccion) {
      throw AppError.badRequest("La atraccion indicada no existe");
    }
    return repository.create(data);
  }

  async listar(): Promise<IMantenimiento[]> {
    return repository.findAll();
  }

  async obtenerPorId(id: string): Promise<IMantenimiento> {
    const mantenimiento = await repository.findById(id);
    if (!mantenimiento) {
      throw AppError.notFound("Mantenimiento no encontrado");
    }
    return mantenimiento;
  }

  async actualizar(id: string, data: Partial<IMantenimiento>): Promise<IMantenimiento> {
    if (data.atraccion) {
      const atraccion = await Atraccion.findById(data.atraccion);
      if (!atraccion) {
        throw AppError.badRequest("La atraccion indicada no existe");
      }
    }
    const mantenimiento = await repository.update(id, data);
    if (!mantenimiento) {
      throw AppError.notFound("Mantenimiento no encontrado");
    }
    return mantenimiento;
  }

  async eliminar(id: string): Promise<void> {
    const mantenimiento = await repository.delete(id);
    if (!mantenimiento) {
      throw AppError.notFound("Mantenimiento no encontrado");
    }
  }
}
