# API CRUD en Capas — Parque de Atracciones (Semana 3)

API REST construida con Express 5 y TypeScript, organizada en arquitectura de 4 capas: `routes → controllers → services → repositories`. Sin base de datos — los datos persisten en memoria dentro de la capa de repositorio.

## Arquitectura
src/
├── app.ts # Configuración de Express y middlewares
├── server.ts # Arranque del servidor
├── routes/
│ └── atraccion.routes.ts # Mapea URLs + verbos HTTP a controllers
├── controllers/
│ └── atraccion.controller.ts # Thin controllers: req/res, sin lógica de negocio
├── services/
│ └── atraccion.service.ts # Lógica de negocio y validaciones
├── repositories/
│ └── atraccion.repository.ts # Acceso a datos (array en memoria)
├── dtos/
│ └── atraccion.dto.ts # Contratos de entrada/salida tipados
├── types/
│ ├── atraccion.ts # Modelo interno
│ └── apiResponse.ts # Contrato de respuesta estándar
└── middlewares/
└── errorHandler.ts # Traduce errores a respuestas HTTP consistentes

### Responsabilidad de cada capa

- **routes** — define endpoints, no tiene lógica
- **controllers** — extrae datos del request, llama al service, arma la respuesta HTTP
- **services** — lógica de negocio y validaciones; lanza `ServiceError` cuando algo falla
- **repositories** — acceso a los datos; no sabe nada de HTTP ni de reglas de negocio

## Instalación

\`\`\`bash
pnpm install
\`\`\`

## Ejecución

\`\`\`bash
pnpm dev
\`\`\`

Servidor disponible en `http://localhost:3000`

## Contrato de respuesta

### Éxito

\`\`\`json
{
  "success": true,
  "data": { ... },
  "meta": { "total": 10 }
}
\`\`\`

### Error

\`\`\`json
{
  "success": false,
  "error": {
    "message": "Atracción no encontrada",
    "code": "NOT_FOUND"
  }
}
\`\`\`

## Endpoints

| Método | Ruta                        | Descripción                       |
|--------|-----------------------------|------------------------------------|
| GET    | `/`                         | Mensaje de bienvenida              |
| GET    | `/atracciones`              | Lista todas las atracciones        |
| GET    | `/atracciones?categoria=X`  | Filtra por categoría               |
| GET    | `/atracciones/:id`          | Obtiene una atracción por id       |
| POST   | `/atracciones`              | Crea una nueva atracción           |
| PUT    | `/atracciones/:id`          | Actualiza una atracción existente  |
| DELETE | `/atracciones/:id`          | Elimina una atracción              |

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

## Códigos de error

| Código              | Status | Descripción                          |
|---------------------|--------|----------------------------------------|
| `VALIDATION_ERROR`  | 400    | Faltan campos o datos inválidos       |
| `NOT_FOUND`         | 404    | Atracción no encontrada               |
| `ROUTE_NOT_FOUND`   | 404    | Ruta no existe                        |
| `INTERNAL_ERROR`    | 500    | Error inesperado del servidor         |