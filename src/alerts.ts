import type { Attraction, LowStockAlert } from "./types.js";

/**
 * RF-03: Devuelve las atracciones cuyo stock es menor o igual
 * al umbral recibido por argumento.
 */
export function getLowStockAlerts(
  attractions: Attraction[],
  threshold: number
): LowStockAlert[] {
  return attractions
    .filter((a) => a.stock <= threshold)
    .sort((a, b) => a.stock - b.stock)
    .map((a) => ({
      id: a.id,
      name: a.name,
      category: a.category,
      stock: a.stock,
    }));
}
