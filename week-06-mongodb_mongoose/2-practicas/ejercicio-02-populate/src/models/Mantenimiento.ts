import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMantenimiento extends Document {
  descripcion: string;
  estado: "pendiente" | "en_proceso" | "completado";
  fecha: Date;
  atraccion: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const mantenimientoSchema = new Schema<IMantenimiento>(
  {
    descripcion: {
      type: String,
      required: [true, "La descripcion es obligatoria"],
      trim: true,
      minlength: [5, "La descripcion debe tener al menos 5 caracteres"]
    },
    estado: {
      type: String,
      enum: {
        values: ["pendiente", "en_proceso", "completado"],
        message: "Estado invalido: {VALUE}"
      },
      default: "pendiente"
    },
    fecha: {
      type: Date,
      default: Date.now
    },
    atraccion: {
      type: Schema.Types.ObjectId,
      ref: "Atraccion",
      required: [true, "La atraccion es obligatoria"]
    }
  },
  {
    timestamps: true
  }
);

export const Mantenimiento = mongoose.model<IMantenimiento>("Mantenimiento", mantenimientoSchema);
