import mongoose, { Schema, Document } from "mongoose";

export interface IAtraccion extends Document {
  nombre: string;
  categoria: string;
  precio: number;
  capacidad: number;
  alturaMinima: number;
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
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0.01, "El precio debe ser un valor positivo"]
    },
    capacidad: {
      type: Number,
      required: [true, "La capacidad es obligatoria"],
      min: [1, "La capacidad debe ser un entero positivo"]
    },
    alturaMinima: {
      type: Number,
      default: 0,
      min: [0, "La altura minima no puede ser negativa"]
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
