import { readCatalog } from "./catalogReader.js";
import { buildSummary } from "./summary.js";
import { filterByCategory } from "./categoryFilter.js";
import { writeReport } from "./report.js";
import type { Attraction, CatalogSummary, InventoryReport } from "./types.js";

const DATA_PATH = "data/attractions.json";
const REPORT_PATH = "output/report.json";

/**
 * Parsea --category <valor> de process.argv.
 * Devuelve null si no se recibió el flag.
 */
function parseCategory(argv: string[]): string | null {
  const flagIndex = argv.indexOf("--category");
  if (flagIndex === -1) return null;

  const value = argv[flagIndex + 1];
  if (value === undefined) {
    console.warn(
      "⚠️  Se pasó --category sin ningún valor. Se mostrará el catálogo completo."
    );
    return null;
  }

  return value;
}

function printGeneralSummary(summary: CatalogSummary): void {
  console.log("🎢 Resumen del catálogo del parque");
  console.log("──────────────────────────────────");
  console.log(`Total de atracciones:      ${summary.totalItems}`);
  console.log(`Operativas:                ${summary.availableCount}`);
  console.log(`No operativas:             ${summary.unavailableCount}`);
  console.log(`Precio promedio:           $${summary.averagePrice}`);

  if (summary.mostExpensive) {
    console.log(
      `Más cara:                  ${summary.mostExpensive.name} ($${summary.mostExpensive.price})`
    );
  }
  if (summary.cheapest) {
    console.log(
      `Más barata:                ${summary.cheapest.name} ($${summary.cheapest.price})`
    );
  }
  console.log("");
}

function printFilterResult(
  requestedCategory: string | null,
  found: boolean,
  items: Attraction[],
  availableCategories: string[]
): void {
  if (requestedCategory === null) {
    console.log(`📋 Mostrando todas las categorías (${items.length} atracciones)`);
    return;
  }

  if (!found) {
    console.log(`⚠️  No se encontró la categoría "${requestedCategory}".`);
    console.log("Categorías disponibles:");
    for (const category of availableCategories) {
      console.log(`  - ${category}`);
    }
    return;
  }

  console.log(`📋 Atracciones en la categoría "${requestedCategory}" (${items.length})`);
  console.log("──────────────────────────────────");
  for (const item of items) {
    console.log(`- ${item.name}: $${item.price} (stock: ${item.stock})`);
  }
}

async function main(): Promise<void> {
  const requestedCategory = parseCategory(process.argv.slice(2));

  const attractions = await readCatalog(DATA_PATH);
  const summary = buildSummary(attractions);
  const filterResult = filterByCategory(attractions, requestedCategory);

  printGeneralSummary(summary);
  printFilterResult(
    filterResult.requestedCategory,
    filterResult.found,
    filterResult.items,
    filterResult.availableCategories
  );

  const report: InventoryReport = {
    generatedAt: new Date().toISOString(),
    summary,
    filter: {
      requestedCategory: filterResult.requestedCategory,
      found: filterResult.found,
      matchCount: filterResult.items.length,
    },
    items: filterResult.items,
  };

  await writeReport(REPORT_PATH, report);

  console.log("");
  console.log(`✅ Reporte escrito en ${REPORT_PATH}`);
}

main().catch((err) => {
  // RF-05: error descriptivo, sin stack trace crudo
  const message = err instanceof Error ? err.message : String(err);
  console.error(`❌ Error: ${message}`);
  process.exit(1);
});
