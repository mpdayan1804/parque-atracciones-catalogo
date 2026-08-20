import type { Atraccion } from "../types/atraccion.js";

const atracciones: Atraccion[] = [
  { id: 1, nombre: "Montaña Rusa Fénix", categoria: "extrema", precio: 25000, capacidad: 24, alturaMinima: 140, activa: true },
  { id: 2, nombre: "Río Rápido", categoria: "acuatica", precio: 18000, capacidad: 12, alturaMinima: 110, activa: true },
  { id: 3, nombre: "Carrusel Encantado", categoria: "infantil", precio: 10000, capacidad: 20, alturaMinima: 0, activa: true },
  { id: 4, nombre: "Rueda de la Fortuna", categoria: "familiar", precio: 15000, capacidad: 32, alturaMinima: 90, activa: true },
  { id: 5, nombre: "Caída Libre Extrema", categoria: "extrema", precio: 30000, capacidad: 8, alturaMinima: 150, activa: true },
  { id: 6, nombre: "Splash Mountain", categoria: "acuatica", precio: 20000, capacidad: 10, alturaMinima: 120, activa: true },
  { id: 7, nombre: "Tren Infantil", categoria: "infantil", precio: 8000, capacidad: 16, alturaMinima: 0, activa: true },
  { id: 8, nombre: "Casa del Terror", categoria: "familiar", precio: 17000, capacidad: 14, alturaMinima: 100, activa: true },
  { id: 9, nombre: "Tazas Locas", categoria: "infantil", precio: 9000, capacidad: 18, alturaMinima: 90, activa: true },
  { id: 10, nombre: "Torre del Pánico", categoria: "extrema", precio: 28000, capacidad: 6, alturaMinima: 145, activa: false }
];

export const atraccionRepository = {
  findAll(): Atraccion[] {
    return atracciones;
  },

  findById(id: number): Atraccion | undefined {
    return atracciones.find((a) => a.id === id);
  },

  findByCategoria(categoria: string): Atraccion[] {
    return atracciones.filter((a) => a.categoria === categoria);
  },

  create(atraccion: Atraccion): Atraccion {
    atracciones.push(atraccion);
    return atraccion;
  },

  update(id: number, cambios: Partial<Atraccion>): Atraccion | undefined {
    const index = atracciones.findIndex((a) => a.id === id);
    if (index === -1) return undefined;

    const actual = atracciones[index]!;
    atracciones[index] = { ...actual, ...cambios };
    return atracciones[index];
  },

  delete(id: number): Atraccion | undefined {
    const index = atracciones.findIndex((a) => a.id === id);
    if (index === -1) return undefined;

    return atracciones.splice(index, 1)[0];
  },

  getNextId(): number {
    return atracciones.length > 0 ? Math.max(...atracciones.map((a) => a.id)) + 1 : 1;
  }
};