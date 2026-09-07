import { Visitante, IVisitante } from "../models/Visitante.js";

export class VisitanteRepository {
  async create(data: Partial<IVisitante>): Promise<IVisitante> {
    return Visitante.create(data);
  }

  async findAll(): Promise<IVisitante[]> {
    return Visitante.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IVisitante | null> {
    return Visitante.findById(id);
  }

  async update(id: string, data: Partial<IVisitante>): Promise<IVisitante | null> {
    return Visitante.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
  }

  async delete(id: string): Promise<IVisitante | null> {
    return Visitante.findByIdAndDelete(id);
  }
}
