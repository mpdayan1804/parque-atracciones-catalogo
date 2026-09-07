import { Mantenimiento, IMantenimiento } from "../models/Mantenimiento.js";

export class MantenimientoRepository {
  async create(data: Partial<IMantenimiento>): Promise<IMantenimiento> {
    return Mantenimiento.create(data);
  }

  async findAll(): Promise<IMantenimiento[]> {
    return Mantenimiento.find()
      .populate("atraccion", "nombre categoria activa")
      .sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IMantenimiento | null> {
    return Mantenimiento.findById(id).populate("atraccion", "nombre categoria activa");
  }

  async update(id: string, data: Partial<IMantenimiento>): Promise<IMantenimiento | null> {
    return Mantenimiento.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    }).populate("atraccion", "nombre categoria activa");
  }

  async delete(id: string): Promise<IMantenimiento | null> {
    return Mantenimiento.findByIdAndDelete(id);
  }
}
