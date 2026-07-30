/**
 * Dominio: Parque de atracciones
 * Recurso principal: Attraction (Atracción)
 */
export interface Attraction {
  id: number;
  name: string;
  category: string;
  /** Indica si la atracción está operativa actualmente */
  available: boolean;
  /** Cupos disponibles para el siguiente turno de operación */
  stock: number;
  /** Precio del boleto/pase en pesos */
  price: number;
}

export interface PriceExtreme {
  id: number;
  name: string;
  price: number;
}

export interface CatalogSummary {
  totalItems: number;
  availableCount: number;
  unavailableCount: number;
  averagePrice: number;
  mostExpensive: PriceExtreme | null;
  cheapest: PriceExtreme | null;
}

export interface CategoryFilterResult {
  /** Categoría solicitada, o null si no se pasó --category */
  requestedCategory: string | null;
  /** true si la categoría existe en el catálogo (o no se pidió ninguna) */
  found: boolean;
  /** Atracciones que coinciden con la categoría (todas, si no hay filtro) */
  items: Attraction[];
  /** Categorías disponibles en el catálogo (útil cuando found = false) */
  availableCategories: string[];
}

export interface InventoryReport {
  generatedAt: string;
  summary: CatalogSummary;
  filter: {
    requestedCategory: string | null;
    found: boolean;
    matchCount: number;
  };
  items: Attraction[];
}
