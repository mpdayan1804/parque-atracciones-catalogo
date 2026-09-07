import mongoose, { Schema, Document } from "mongoose";

export interface IVisitante extends Document {
  nombre: string;
  edad: number;
  tienePase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const visitanteSchema = new Schema<IVisitante>(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"]
    },
    edad: {
      type: Number,
      required: [true, "La edad es obligatoria"],
      min: [0, "La edad no puede ser negativa"],
      max: [120, "La edad no es valida"]
    },
    tienePase: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const Visitante = mongoose.model<IVisitante>("Visitante", visitanteSchema);
