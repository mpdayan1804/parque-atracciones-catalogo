import mongoose, { Schema, Document } from "mongoose";

export type Categoria = "acceso" | "montana_rusa" | "acuario" | "espectaculo" | "comida";

export interface IAtraccion extends Document {
  nombre: string;
  descripcion: string;
  categoria: Categoria;
  capacidad: number;
  altura_minima?: number;
  precio: number;
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
      minlength: [3, "El nombre debe tener al menos 3 caracteres"],
      maxlength: [100, "El nombre no puede exceder 100 caracteres"]
    },
    descripcion: {
      type: String,
      required: [true, "La descripcion es obligatoria"],
      trim: true,
      minlength: [10, "La descripcion debe tener al menos 10 caracteres"],
      maxlength: [500, "La descripcion no puede exceder 500 caracteres"]
    },
    categoria: {
      type: String,
      enum: {
        values: ["acceso", "montana_rusa", "acuario", "espectaculo", "comida"],
        message: "Categoria invalida: {VALUE}"
      },
      required: [true, "La categoria es obligatoria"]
    },
    capacidad: {
      type: Number,
      required: [true, "La capacidad es obligatoria"],
      min: [1, "La capacidad debe ser al menos 1"],
      max: [1000, "La capacidad no puede exceder 1000"]
    },
    altura_minima: {
      type: Number,
      min: [0, "La altura minima no puede ser negativa"],
      max: [250, "La altura minima no puede exceder 250cm"],
      default: 0
    },
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
      max: [1000, "El precio no puede exceder 1000"]
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

// Índices para mejorar búsquedas
atraccionSchema.index({ categoria: 1, activa: 1 });
atraccionSchema.index({ nombre: "text", descripcion: "text" });

export const Atraccion = mongoose.model<IAtraccion>("Atraccion", atraccionSchema);
