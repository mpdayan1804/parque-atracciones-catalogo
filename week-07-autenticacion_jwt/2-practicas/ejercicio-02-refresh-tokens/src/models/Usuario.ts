import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUsuario extends Document {
  nombre: string;
  email: string;
  password: string;
  refreshTokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
  compararPassword(candidata: string): Promise<boolean>;
}

const usuarioSchema = new Schema<IUsuario>(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"]
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "El email no es valido"]
    },
    password: {
      type: String,
      required: [true, "La contrasena es obligatoria"],
      minlength: [8, "La contrasena debe tener al menos 8 caracteres"],
      select: false
    },
    refreshTokenVersion: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

usuarioSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const saltRounds = 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

usuarioSchema.methods.compararPassword = async function (candidata: string): Promise<boolean> {
  return bcrypt.compare(candidata, this.password);
};

export const Usuario = mongoose.model<IUsuario>("Usuario", usuarioSchema);
