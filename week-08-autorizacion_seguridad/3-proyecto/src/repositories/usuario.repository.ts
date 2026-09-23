import { Usuario, IUsuario } from "../models/Usuario.js";

export class UsuarioRepository {
  async crear(datos: Partial<IUsuario>): Promise<IUsuario> {
    const usuario = new Usuario(datos);
    return await usuario.save();
  }

  async buscarPorEmail(email: string): Promise<IUsuario | null> {
    return await Usuario.findOne({ email }).select("+password");
  }

  async buscarPorId(id: string): Promise<IUsuario | null> {
    return await Usuario.findById(id);
  }

  async listar(skip: number = 0, limit: number = 10): Promise<IUsuario[]> {
    return await Usuario.find()
      .skip(skip)
      .limit(limit)
      .select("-password")
      .sort({ createdAt: -1 });
  }

  async actualizar(id: string, datos: Partial<IUsuario>): Promise<IUsuario | null> {
    return await Usuario.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
  }

  async eliminar(id: string): Promise<IUsuario | null> {
    return await Usuario.findByIdAndDelete(id);
  }

  async contar(): Promise<number> {
    return await Usuario.countDocuments();
  }
}

export const usuarioRepository = new UsuarioRepository();
