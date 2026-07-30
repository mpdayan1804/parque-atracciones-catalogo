import type { Attraction, CategoryFilterResult } from "./types.js";

/**
 * RF-03: Filtra las atracciones por categoría.
 * Si no se pasa categoría (null), devuelve el catálogo completo.
 * Si se pasa una categoría que no existe, found = false y se listan
 * las categorías disponibles para que el usuario las conozca.
 */
export function filterByCategory(
  attractions: Attraction[],
  requestedCategory: string | null
): CategoryFilterResult {
  const availableCategories = [
    ...new Set(attractions.map((a) => a.category)),
  ].sort();

  if (requestedCategory === null) {
    return {
      requestedCategory: null,
      found: true,
      items: attractions,
      availableCategories,
    };
  }

  // Comparación case-insensitive para que "acuática" y "Acuática" coincidan
  const normalizedRequest = requestedCategory.trim().toLowerCase();
  const items = attractions.filter(
    (a) => a.category.toLowerCase() === normalizedRequest
  );

  return {
    requestedCategory,
    found: items.length > 0,
    items,
    availableCategories,
  };
}
