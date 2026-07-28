import type { Attraction, CatalogSummary } from "./types.js";

/**
 * RF-02: Calcula el resumen del catálogo:
 * total de atracciones, disponibles vs no disponibles,
 * y la atracción con menor stock.
 */
export function buildSummary(attractions: Attraction[]): CatalogSummary {
  const totalItems = attractions.length;
  const availableCount = attractions.filter((a) => a.available).length;
  const unavailableCount = totalItems - availableCount;

  let lowestStockItem: CatalogSummary["lowestStockItem"] = null;

  for (const attraction of attractions) {
    if (
      lowestStockItem === null ||
      attraction.stock < lowestStockItem.stock
    ) {
      lowestStockItem = {
        id: attraction.id,
        name: attraction.name,
        stock: attraction.stock,
      };
    }
  }

  return {
    totalItems,
    availableCount,
    unavailableCount,
    lowestStockItem,
  };
}
