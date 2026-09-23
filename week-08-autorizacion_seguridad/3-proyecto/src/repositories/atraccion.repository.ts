import { Atraccion, IAtraccion, Categoria } from "../models/Atraccion.js";

export class AtraccionRepository {
  async crear(datos: Partial<IAtraccion>): Promise<IAtraccion> {
    const atraccion = new Atraccion(datos);
    return await atraccion.save();
  }

  async buscarPorId(id: string): Promise<IAtraccion | null> {
    return await Atraccion.findById(id);
  }

  async listar(filtros: {
    categoria?: Categoria;
    activa?: boolean;
    precio_max?: number;
    skip?: number;
    limit?: number;
  } = {}): Promise<IAtraccion[]> {
    const query: any = {};

    if (filtros.categoria) {
      query.categoria = filtros.categoria;
    }

    if (filtros.activa !== undefined) {
      query.activa = filtros.activa;
    }

    if (filtros.precio_max !== undefined) {
      query.precio = { $lte: filtros.precio_max };
    }

    return await Atraccion.find(query)
      .skip(filtros.skip || 0)
      .limit(filtros.limit || 10)
      .sort({ createdAt: -1 });
  }

  async actualizar(id: string, datos: Partial<IAtraccion>): Promise<IAtraccion | null> {
    return await Atraccion.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
  }

  async eliminar(id: string): Promise<IAtraccion | null> {
    return await Atraccion.findByIdAndDelete(id);
  }

  async contar(filtros: any = {}): Promise<number> {
    return await Atraccion.countDocuments(filtros);
  }

  async buscarPorCategoria(categoria: Categoria): Promise<IAtraccion[]> {
    return await Atraccion.find({ categoria, activa: true });
  }
}

export const atraccionRepository = new AtraccionRepository();
