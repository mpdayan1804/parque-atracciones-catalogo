import { mkdir, writeFile } from "fs/promises";
import { dirname } from "path";
import type { InventoryReport } from "./types.js";

/**
 * RF-04: Escribe el resumen + las alertas en output/report.json.
 */
export async function writeReport(
  filePath: string,
  report: InventoryReport
): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  const json = JSON.stringify(report, null, 2);
  await writeFile(filePath, json, "utf-8");
}
