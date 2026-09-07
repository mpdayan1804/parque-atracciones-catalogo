import { Atraccion, IAtraccion } from "../models/Atraccion.js";

export class AtraccionRepository {
  async create(data: Partial<IAtraccion>): Promise<IAtraccion> {
    return Atraccion.create(data);
  }

  async findAll(): Promise<IAtraccion[]> {
    return Atraccion.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IAtraccion | null> {
    return Atraccion.findById(id);
  }

  async delete(id: string): Promise<IAtraccion | null> {
    return Atraccion.findByIdAndDelete(id);
  }
}
