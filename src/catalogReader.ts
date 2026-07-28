import { readFile } from "fs/promises";
import type { Attraction } from "./types.js";

/**
 * RF-01: Lee el catálogo de atracciones desde un archivo JSON.
 * RF-05: Si el archivo no existe (u otro error de lectura/parseo),
 * lanza un error descriptivo para que el llamador lo maneje.
 */
export async function readCatalog(filePath: string): Promise<Attraction[]> {
  let raw: string;

  try {
    raw = await readFile(filePath, "utf-8");
  } catch (err) {
    const nodeErr = err as NodeJS.ErrnoException;
    if (nodeErr.code === "ENOENT") {
      throw new Error(
        `No se encontró el archivo de catálogo en "${filePath}". ` +
          `Verifica que exista antes de ejecutar el programa.`
      );
    }
    throw new Error(
      `No se pudo leer el archivo "${filePath}": ${nodeErr.message}`
    );
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(
      `El archivo "${filePath}" no contiene un JSON válido. Revisa su formato.`
    );
  }

  if (!Array.isArray(data)) {
    throw new Error(
      `El archivo "${filePath}" debe contener un arreglo de atracciones.`
    );
  }

  return data as Attraction[];
}
