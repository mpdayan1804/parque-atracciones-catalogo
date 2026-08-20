import type { Categoria } from "../types/atraccion.js";

// DTO de entrada para crear una atracción (POST)
export interface CreateAtraccionDTO {
  nombre: string;
  categoria: Categoria;
  precio: number;
  capacidad: number;
  alturaMinima?: number;
  activa?: boolean;
}

// DTO de entrada para actualizar una atracción (PUT) — todos los campos opcionales
export interface UpdateAtraccionDTO {
  nombre?: string;
  categoria?: Categoria;
  precio?: number;
  capacidad?: number;
  alturaMinima?: number;
  activa?: boolean;
}

// DTO de salida — lo que la API devuelve al cliente
export interface AtraccionResponseDTO {
  id: number;
  nombre: string;
  categoria: Categoria;
  precio: number;
  capacidad: number;
  alturaMinima: number;
  activa: boolean;
}