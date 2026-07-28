# Catálogo con Reporte de Inventario — Parque de Atracciones 🎢

CLI construida con **Node.js + TypeScript + async/await** que lee el catálogo
de atracciones de un parque, calcula un resumen y alertas de inventario bajo,
y escribe un reporte en `output/report.json`.

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
starter/
├── data/
│   └── attractions.json     # catálogo (10 atracciones)
├── src/
│   ├── types.ts              # interfaces: Attraction, CatalogSummary, etc.
│   ├── catalogReader.ts       # RF-01 + RF-05: lectura y manejo de errores
│   ├── summary.ts             # RF-02: resumen del catálogo
│   ├── alerts.ts               # RF-03: alertas de inventario bajo
│   ├── report.ts               # RF-04: escritura del reporte
│   └── index.ts                 # orquesta todo + parseo de --umbral
├── output/
│   └── report.json            # generado al correr el programa
├── package.json
├── tsconfig.json
└── README.md
```

## Cómo correr el proyecto

```bash
cd 3-proyecto/starter
pnpm install
pnpm dev                  # resumen + alertas con umbral por defecto (5)
pnpm dev -- --umbral 3    # con umbral propio
pnpm build                # compila a dist/ sin errores de TypeScript
pnpm start                # corre la versión compilada
```

## Requisitos funcionales cubiertos

- **RF-01**: `catalogReader.ts` lee `data/attractions.json` con `fs/promises`.
- **RF-02**: `summary.ts` calcula total de atracciones, operativas vs no
  operativas, y la atracción con menor stock.
- **RF-03**: `alerts.ts` lista las atracciones con `stock <= umbral`
  (recibido por `--umbral`, por defecto `5`).
- **RF-04**: `report.ts` escribe resumen + alertas en `output/report.json`.
- **RF-05**: si `attractions.json` no existe, se muestra un error
  descriptivo (sin stack trace) y el proceso termina con `process.exit(1)`.

## Ejemplo de salida (consola)

```
🎢 Resumen del catálogo del parque
──────────────────────────────────
Total de atracciones:      10
Operativas:                9
No operativas:             1
Menor stock:               Casa del Terror (0 cupos)

🚨 Alertas de inventario bajo (umbral <= 5)
──────────────────────────────────
- Casa del Terror [Temática]: 0 cupos disponibles
- Splash Extremo [Acuática]: 1 cupos disponibles
- Torre de Caída Libre [Extrema]: 2 cupos disponibles
- Rueda Panorámica [Familiar]: 3 cupos disponibles
- Río Salvaje [Acuática]: 4 cupos disponibles
- Tren Fantasma [Temática]: 5 cupos disponibles

✅ Reporte escrito en output/report.json
```
