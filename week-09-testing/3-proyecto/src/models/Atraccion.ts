import mongoose, { Schema, Document } from 'mongoose';

export type Categoria = 'acceso' | 'montana_rusa' | 'acuario' | 'espectaculo' | 'comida';

export interface IAtraccion extends Document {
  nombre: string;
  descripcion: string;
  categoria: Categoria;
  capacidad: number;
  precio: number;
  activa: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const atraccionSchema = new Schema<IAtraccion>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres']
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      minlength: [10, 'La descripción debe tener al menos 10 caracteres']
    },
    categoria: {
      type: String,
      enum: {
        values: ['acceso', 'montana_rusa', 'acuario', 'espectaculo', 'comida'],
        message: 'Categoría inválida: {VALUE}'
      },
      required: [true, 'La categoría es obligatoria']
    },
    capacidad: {
      type: Number,
      required: [true, 'La capacidad es obligatoria'],
      min: [1, 'La capacidad debe ser al menos 1'],
      max: [1000, 'La capacidad no puede exceder 1000']
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
      max: [1000, 'El precio no puede exceder 1000']
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

export const Atraccion = mongoose.model<IAtraccion>('Atraccion', atraccionSchema);
