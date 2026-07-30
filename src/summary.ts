import type { Attraction, CatalogSummary, PriceExtreme } from "./types.js";

/**
 * RF-02: Calcula el resumen del catálogo:
 * total, disponibles vs no disponibles, precio promedio,
 * y la atracción más cara / más barata.
 */
export function buildSummary(attractions: Attraction[]): CatalogSummary {
  const totalItems = attractions.length;
  const availableCount = attractions.filter((a) => a.available).length;
  const unavailableCount = totalItems - availableCount;

  let averagePrice = 0;
  let mostExpensive: PriceExtreme | null = null;
  let cheapest: PriceExtreme | null = null;

  if (totalItems > 0) {
    const totalPrice = attractions.reduce((sum, a) => sum + a.price, 0);
    averagePrice = Math.round((totalPrice / totalItems) * 100) / 100;

    for (const attraction of attractions) {
      if (mostExpensive === null || attraction.price > mostExpensive.price) {
        mostExpensive = {
          id: attraction.id,
          name: attraction.name,
          price: attraction.price,
        };
      }
      if (cheapest === null || attraction.price < cheapest.price) {
        cheapest = {
          id: attraction.id,
          name: attraction.name,
          price: attraction.price,
        };
      }
    }
  }

  return {
    totalItems,
    availableCount,
    unavailableCount,
    averagePrice,
    mostExpensive,
    cheapest,
  };
}
