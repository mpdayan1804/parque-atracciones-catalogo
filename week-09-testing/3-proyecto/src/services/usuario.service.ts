import { Usuario } from '../models/Usuario.js';

export class UsuarioService {
  async crear(datos: any) {
    const usuario = new Usuario(datos);
    return await usuario.save();
  }

  async buscarPorEmail(email: string) {
    return await Usuario.findOne({ email });
  }

  async buscarPorId(id: string) {
    return await Usuario.findById(id);
  }

  async listar(skip: number = 0, limit: number = 10) {
    return await Usuario.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async actualizar(id: string, datos: any) {
    return await Usuario.findByIdAndUpdate(id, datos, { new: true });
  }

  async eliminar(id: string) {
    return await Usuario.findByIdAndDelete(id);
  }
}
