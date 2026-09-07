import mongoose, { Schema, Document } from "mongoose";

export interface IAtraccion extends Document {
  nombre: string;
  categoria: string;
  activa: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const atraccionSchema = new Schema<IAtraccion>(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"]
    },
    categoria: {
      type: String,
      required: [true, "La categoria es obligatoria"],
      enum: {
        values: ["mecanica", "acuatica", "infantil", "extrema", "familiar"],
        message: "Categoria invalida: {VALUE}"
      }
    },
    activa: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const Atraccion = mongoose.model<IAtraccion>("Atraccion", atraccionSchema);
