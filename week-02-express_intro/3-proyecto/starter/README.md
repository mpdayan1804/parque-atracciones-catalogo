# API CRUD — Parque de Atracciones (Semana 2)

API REST en memoria construida con Express 5 y TypeScript, que gestiona las atracciones de un parque de diversiones.

## Tecnologías

- Node.js + TypeScript
- Express 5
- Middlewares: `express.json()`, `morgan`, `cors`
- Sin base de datos — los datos viven en un array en memoria (`src/data/atracciones.ts`)

## Instalación

\`\`\`bash
pnpm install
\`\`\`

## Ejecución

\`\`\`bash
pnpm dev
\`\`\`

Servidor disponible en `http://localhost:3000`

## Endpoints

| Método | Ruta                          | Descripción                                  |
|--------|-------------------------------|-----------------------------------------------|
| GET    | `/`                            | Mensaje de bienvenida                         |
| GET    | `/atracciones`                 | Lista todas las atracciones                   |
| GET    | `/atracciones?categoria=X`     | Filtra atracciones por categoría              |
| GET    | `/atracciones/:id`             | Obtiene una atracción por id                  |
| POST   | `/atracciones`                 | Crea una nueva atracción                      |
| PUT    | `/atracciones/:id`             | Actualiza una atracción existente             |
| DELETE | `/atracciones/:id`             | Elimina una atracción                         |

### Categorías válidas

`mecanica`, `acuatica`, `infantil`, `extrema`, `familiar`

### Ejemplo de body para POST/PUT

\`\`\`json
{
  "nombre": "Barco Pirata",
  "categoria": "familiar",
  "precio": 12000,
  "capacidad": 20,
  "alturaMinima": 100
}
\`\`\`

## Manejo de errores

- `404` — Atracción no encontrada / ruta no encontrada
- `400` — Faltan campos obligatorios en el body
- `500` — Error interno del servidor (middleware centralizado)

## Estructura del proyecto

\`\`\`
src/
├── app.ts                    # Configuración de Express y middlewares
├── server.ts                 # Arranque del servidor
├── types.ts                  # Tipos de datos
├── data/
│   └── atracciones.ts        # Array en memoria
├── routes/
│   └── atracciones.routes.ts # Rutas CRUD
└── middlewares/
    └── errorHandler.ts       # Manejo centralizado de errores
\`\`\`