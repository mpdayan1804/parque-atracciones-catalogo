import mongoose, { Schema, Document } from "mongoose";

export interface IVisitante extends Document {
  nombre: string;
  email: string;
  telefono?: string;
  fecha_visita: Date;
  createdAt: Date;
  updatedAt: Date;
}

const visitanteSchema = new Schema<IVisitante>(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [50, "El nombre no puede exceder 50 caracteres"]
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "El email no es valido"]
    },
    telefono: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, "El telefono debe tener 10 digitos"],
      default: ""
    },
    fecha_visita: {
      type: Date,
      required: [true, "La fecha de visita es obligatoria"],
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Índices para mejorar búsquedas
visitanteSchema.index({ email: 1 });
visitanteSchema.index({ fecha_visita: 1 });

export const Visitante = mongoose.model<IVisitante>("Visitante", visitanteSchema);
