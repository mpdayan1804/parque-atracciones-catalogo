import { Usuario, IUsuario } from "../models/Usuario.js";

export const authRepository = {
  async crear(data: { nombre: string; email: string; password: string }): Promise<IUsuario> {
    return Usuario.create(data);
  },

  async buscarPorEmailConPassword(email: string): Promise<IUsuario | null> {
    return Usuario.findOne({ email }).select("+password");
  },

  async buscarPorId(id: string): Promise<IUsuario | null> {
    return Usuario.findById(id);
  },

  async existePorEmail(email: string): Promise<boolean> {
    const count = await Usuario.countDocuments({ email });
    return count > 0;
  },

  async incrementarVersion(id: string): Promise<IUsuario | null> {
    return Usuario.findByIdAndUpdate(
      id,
      { $inc: { refreshTokenVersion: 1 } },
      { new: true }
    );
  },

  async findAll(): Promise<IUsuario[]> {
    return Usuario.find().sort({ createdAt: -1 });
  },

  async actualizarRol(id: string, role: "user" | "admin"): Promise<IUsuario | null> {
    return Usuario.findByIdAndUpdate(id, { role }, { new: true, runValidators: true });
  }
};
