import { readCatalog } from "./catalogReader.js";
import { buildSummary } from "./summary.js";
import { getLowStockAlerts } from "./alerts.js";
import { writeReport } from "./report.js";
import type { InventoryReport } from "./types.js";

const DATA_PATH = "data/attractions.json";
const REPORT_PATH = "output/report.json";
const DEFAULT_THRESHOLD = 5;

/**
 * Parsea --umbral <n> de process.argv. Si no se recibe, usa el valor por defecto.
 */
function parseThreshold(argv: string[]): number {
  const flagIndex = argv.indexOf("--umbral");
  if (flagIndex === -1) return DEFAULT_THRESHOLD;

  const value = argv[flagIndex + 1];
  const parsed = Number(value);

  if (value === undefined || Number.isNaN(parsed)) {
    console.warn(
      `⚠️  Valor inválido para --umbral ("${value}"). Se usará el valor por defecto (${DEFAULT_THRESHOLD}).`
    );
    return DEFAULT_THRESHOLD;
  }

  return parsed;
}

function printSummary(report: InventoryReport): void {
  const { summary, lowStockAlerts, threshold } = report;

  console.log("🎢 Resumen del catálogo del parque");
  console.log("──────────────────────────────────");
  console.log(`Total de atracciones:      ${summary.totalItems}`);
  console.log(`Operativas:                ${summary.availableCount}`);
  console.log(`No operativas:             ${summary.unavailableCount}`);

  if (summary.lowestStockItem) {
    console.log(
      `Menor stock:               ${summary.lowestStockItem.name} (${summary.lowestStockItem.stock} cupos)`
    );
  }

  console.log("");
  console.log(`🚨 Alertas de inventario bajo (umbral <= ${threshold})`);
  console.log("──────────────────────────────────");

  if (lowStockAlerts.length === 0) {
    console.log("Sin alertas: todas las atracciones superan el umbral.");
  } else {
    for (const alert of lowStockAlerts) {
      console.log(
        `- ${alert.name} [${alert.category}]: ${alert.stock} cupos disponibles`
      );
    }
  }
}

async function main(): Promise<void> {
  const threshold = parseThreshold(process.argv.slice(2));

  const attractions = await readCatalog(DATA_PATH);
  const summary = buildSummary(attractions);
  const lowStockAlerts = getLowStockAlerts(attractions, threshold);

  const report: InventoryReport = {
    generatedAt: new Date().toISOString(),
    threshold,
    summary,
    lowStockAlerts,
  };

  printSummary(report);
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
