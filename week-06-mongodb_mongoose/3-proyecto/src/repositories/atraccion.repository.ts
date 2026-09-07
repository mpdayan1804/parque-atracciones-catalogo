import { Atraccion, IAtraccion } from "../models/Atraccion.js";

export const atraccionRepository = {
  async findAll(categoria?: string) {
    const filtro = categoria ? { categoria } : {};
    return Atraccion.find(filtro).sort({ createdAt: -1 });
  },

  async findById(id: string) {
    return Atraccion.findById(id);
  },

  async create(data: Partial<IAtraccion>) {
    return Atraccion.create(data);
  },

  async update(id: string, data: Partial<IAtraccion>) {
    return Atraccion.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
  },

  async delete(id: string) {
    return Atraccion.findByIdAndDelete(id);
  },

  async count(categoria?: string) {
    const filtro = categoria ? { categoria } : {};
    return Atraccion.countDocuments(filtro);
  }
};
