import { Visitante, IVisitante } from "../models/Visitante.js";

export class VisitanteRepository {
  async crear(datos: Partial<IVisitante>): Promise<IVisitante> {
    const visitante = new Visitante(datos);
    return await visitante.save();
  }

  async buscarPorId(id: string): Promise<IVisitante | null> {
    return await Visitante.findById(id);
  }

  async buscarPorEmail(email: string): Promise<IVisitante | null> {
    return await Visitante.findOne({ email });
  }

  async listar(skip: number = 0, limit: number = 10): Promise<IVisitante[]> {
    return await Visitante.find()
      .skip(skip)
      .limit(limit)
      .sort({ fecha_visita: -1 });
  }

  async actualizar(id: string, datos: Partial<IVisitante>): Promise<IVisitante | null> {
    return await Visitante.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
  }

  async eliminar(id: string): Promise<IVisitante | null> {
    return await Visitante.findByIdAndDelete(id);
  }

  async contar(): Promise<number> {
    return await Visitante.countDocuments();
  }

  async listarPorFecha(fecha: Date): Promise<IVisitante[]> {
    const inicio = new Date(fecha);
    inicio.setHours(0, 0, 0, 0);
    
    const fin = new Date(fecha);
    fin.setHours(23, 59, 59, 999);

    return await Visitante.find({
      fecha_visita: { $gte: inicio, $lte: fin }
    });
  }
}

export const visitanteRepository = new VisitanteRepository();
