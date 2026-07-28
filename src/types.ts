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

export interface CatalogSummary {
  totalItems: number;
  availableCount: number;
  unavailableCount: number;
  lowestStockItem: {
    id: number;
    name: string;
    stock: number;
  } | null;
}

export interface LowStockAlert {
  id: number;
  name: string;
  category: string;
  stock: number;
}

export interface InventoryReport {
  generatedAt: string;
  threshold: number;
  summary: CatalogSummary;
  lowStockAlerts: LowStockAlert[];
}
