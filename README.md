# Catálogo con Filtro por Categoría — Parque de Atracciones 🎢

CLI construida con **Node.js + TypeScript + async/await** que lee el catálogo
de atracciones de un parque, calcula un resumen (con precio promedio y
extremos), filtra por categoría, y escribe un reporte en
`output/report.json`.

## Dominio: Parque de atracciones

| Genérico | Este proyecto |
|---|---|
| `Item` | `Attraction` (Atracción) |
| `items.json` | `attractions.json` |

### Campos de `Attraction`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `number` | Identificador único |
| `name` | `string` | Nombre de la atracción |
| `category` | `string` | Montaña rusa, Acuática, Familiar, Temática, Extrema, Infantil |
| `available` | `boolean` | Si la atracción está operativa actualmente |
| `stock` | `number` | Cupos disponibles para el siguiente turno |
| `price` | `number` | Precio del boleto/pase (COP) |

## Estructura del proyecto

```
├── data/
│   └── attractions.json     # catálogo (10 atracciones)
├── src/
│   ├── types.ts              # interfaces: Attraction, CatalogSummary, etc.
│   ├── catalogReader.ts       # RF-01 + RF-05: lectura y manejo de errores
│   ├── summary.ts             # RF-02: resumen (total, promedio, extremos)
│   ├── categoryFilter.ts      # RF-03: filtro por categoría
│   ├── report.ts              # RF-04: escritura del reporte
│   └── index.ts               # orquesta todo + parseo de --category
├── output/
│   └── report.json            # generado al correr el programa
├── package.json
├── tsconfig.json
└── README.md
```

## Cómo correr el proyecto

```bash
pnpm install
pnpm dev                        # resumen + catálogo completo
pnpm dev -- --category Familiar # filtrado por categoría
pnpm build                      # compila a dist/ sin errores de TypeScript
pnpm start                      # corre la versión compilada
```

## Requisitos funcionales cubiertos

- **RF-01**: `catalogReader.ts` lee `data/attractions.json` con `fs/promises`.
- **RF-02**: `summary.ts` calcula total de atracciones, operativas vs no
  operativas, precio promedio, y la atracción más cara / más barata.
- **RF-03**: `categoryFilter.ts` filtra por `--category` (case-insensitive).
  Si la categoría no existe, muestra un aviso y lista las categorías
  disponibles, sin detener el programa.
- **RF-04**: `report.ts` escribe resumen + filtro aplicado en
  `output/report.json`.
- **RF-05**: si `attractions.json` no existe, se muestra un error
  descriptivo (sin stack trace) y el proceso termina con `process.exit(1)`.

## Ejemplo de salida (consola)

```
🎢 Resumen del catálogo del parque
──────────────────────────────────
Total de atracciones:      10
Operativas:                9
No operativas:             1
Precio promedio:           $26200
Más cara:                  Vórtice Infernal ($45000)
Más barata:                Autos Chocones ($10000)

📋 Atracciones en la categoría "Familiar" (3)
──────────────────────────────────
- Carrusel Encantado: $15000 (stock: 20)
- Laberinto de Espejos: $12000 (stock: 15)
- Rueda Panorámica: $20000 (stock: 3)

✅ Reporte escrito en output/report.json
```
