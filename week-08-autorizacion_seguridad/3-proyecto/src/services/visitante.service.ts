import { visitanteRepository } from "../repositories/visitante.repository.js";
import { AppError } from "../errors/AppError.js";

export class VisitanteService {
  async crear(datos: any) {
    const existeVisitante = await visitanteRepository.buscarPorEmail(datos.email);
    if (existeVisitante) {
      throw AppError.badRequest("El email ya esta registrado");
    }

    const visitante = await visitanteRepository.crear({
      ...datos,
      fecha_visita: new Date(datos.fecha_visita)
    });
    return visitante;
  }

  async obtenerPorId(id: string) {
    const visitante = await visitanteRepository.buscarPorId(id);
    if (!visitante) {
      throw AppError.notFound("Visitante no encontrado");
    }
    return visitante;
  }

  async listar(pagina: number = 1, limite: number = 10) {
    const skip = (pagina - 1) * limite;
    const [visitantes, total] = await Promise.all([
      visitanteRepository.listar(skip, limite),
      visitanteRepository.contar()
    ]);

    return {
      visitantes,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite)
    };
  }

  async actualizar(id: string, datos: any) {
    const visitante = await visitanteRepository.actualizar(id, datos);
    if (!visitante) {
      throw AppError.notFound("Visitante no encontrado");
    }
    return visitante;
  }

  async eliminar(id: string) {
    const visitante = await visitanteRepository.eliminar(id);
    if (!visitante) {
      throw AppError.notFound("Visitante no encontrado");
    }
    return { mensaje: "Visitante eliminado correctamente" };
  }

  async listarPorFecha(fecha: string) {
    const fechaDate = new Date(fecha);
    if (isNaN(fechaDate.getTime())) {
      throw AppError.badRequest("Fecha invalida");
    }

    const visitantes = await visitanteRepository.listarPorFecha(fechaDate);
    return visitantes;
  }
}

export const visitanteService = new VisitanteService();
