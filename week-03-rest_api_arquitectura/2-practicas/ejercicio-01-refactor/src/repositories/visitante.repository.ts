import type { Visitante } from "../types/visitante.js";

const visitantes: Visitante[] = [
  { id: 1, nombre: "Laura Gómez", edad: 28, tienePase: true },
  { id: 2, nombre: "Carlos Ruiz", edad: 34, tienePase: false },
  { id: 3, nombre: "Ana Torres", edad: 19, tienePase: true }
];

export const visitanteRepository = {
  findAll(): Visitante[] {
    return visitantes;
  },

  findById(id: number): Visitante | undefined {
    return visitantes.find((v) => v.id === id);
  },

  create(visitante: Visitante): Visitante {
    visitantes.push(visitante);
    return visitante;
  },

  update(id: number, cambios: Partial<Visitante>): Visitante | undefined {
    const index = visitantes.findIndex((v) => v.id === id);
    if (index === -1) return undefined;

    const actual = visitantes[index]!;
    visitantes[index] = { ...actual, ...cambios };
    return visitantes[index];
  },

  delete(id: number): Visitante | undefined {
    const index = visitantes.findIndex((v) => v.id === id);
    if (index === -1) return undefined;

    return visitantes.splice(index, 1)[0];
  },

  getNextId(): number {
    return visitantes.length > 0 ? Math.max(...visitantes.map((v) => v.id)) + 1 : 1;
  }
};