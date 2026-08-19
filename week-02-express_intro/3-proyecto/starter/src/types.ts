export type Categoria = "mecanica" | "acuatica" | "infantil" | "extrema" | "familiar";

export interface Atraccion {
  id: number;
  nombre: string;
  categoria: Categoria;
  precio: number;
  capacidad: number;
  alturaMinima: number; // en cm
  activa: boolean;
}