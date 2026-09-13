import { Visitante, IVisitante } from "../models/Visitante.js";

export const visitanteRepository = {
  async create(data: Partial<IVisitante>) {
    return Visitante.create(data);
  },

  async findAll() {
    return Visitante.find().sort({ createdAt: -1 });
  },

  async findById(id: string) {
    return Visitante.findById(id);
  }
};
