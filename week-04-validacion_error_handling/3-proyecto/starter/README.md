# API CRUD con Validación y Manejo de Errores — Parque de Atracciones (Semana 4)

API REST construida con Express 5 y TypeScript, extendiendo la arquitectura en capas de la Semana 3 con: validación de datos con Zod, clase `AppError` para errores del dominio, middleware global de errores, 404 handler dedicado, y logging con Winston + Morgan.

## Novedades sobre la Semana 3

- **Validación Zod** (`schemas/`) — todos los endpoints POST/PUT validan el body antes de llegar al controller
- **`AppError`** (`errors/AppError.ts`) — clase de error del dominio con `statusCode`, `code` y métodos estáticos (`notFound`, `badRequest`, etc.)
- **Error handler global mejorado** — distingue `AppError`, `ZodError` y errores no controlados; registra todo con Winston
- **404 handler dedicado** (`middlewares/notFoundHandler.ts`) — separado del error handler general
- **Winston** (`config/logger.ts`) — logger con niveles por entorno (`debug` en desarrollo, `info` en producción) y transport a archivo en producción
- **Morgan integrado con Winston** — cada petición HTTP se registra a través del logger, no de `console.log`

## Arquitectura

\`\`\`
src/
├── app.ts
├── server.ts
├── routes/
│   └── atraccion.routes.ts        # aplica el middleware `validate` en POST/PUT
├── controllers/
│   └── atraccion.controller.ts
├── services/
│   └── atraccion.service.ts
├── repositories/
│   └── atraccion.repository.ts
├── schemas/
│   └── atraccion.schema.ts        # esquemas Zod (create/update)
├── errors/
│   └── AppError.ts
├── middlewares/
│   ├── validate.ts                # middleware genérico de validación Zod
│   ├── errorHandler.ts            # error handler global
│   └── notFoundHandler.ts         # 404 handler
├── config/
│   └── logger.ts                  # configuración de Winston
└── types/
    └── atraccion.ts
\`\`\`

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

### Error de validación (Zod)

\`\`\`json
{
  "success": false,
  "error": {
    "message": "nombre: El nombre debe tener al menos 2 caracteres | precio: El precio debe ser un valor positivo",
    "code": "VALIDATION_ERROR"
  }
}
\`\`\`

### Error 404

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

| Método | Ruta                        | Validación Zod | Descripción                       |
|--------|-----------------------------|-----------------|------------------------------------|
| GET    | `/`                         | —               | Mensaje de bienvenida              |
| GET    | `/atracciones`              | —               | Lista todas las atracciones        |
| GET    | `/atracciones?categoria=X`  | —               | Filtra por categoría               |
| GET    | `/atracciones/:id`          | —               | Obtiene una atracción por id       |
| POST   | `/atracciones`              | ✅ createSchema | Crea una nueva atracción           |
| PUT    | `/atracciones/:id`          | ✅ updateSchema | Actualiza una atracción existente  |
| DELETE | `/atracciones/:id`          | —               | Elimina una atracción              |

### Categorías válidas

`mecanica`, `acuatica`, `infantil`, `extrema`, `familiar`

### Ejemplo de body válido para POST

\`\`\`json
{
  "nombre": "Barco Pirata",
  "categoria": "familiar",
  "precio": 12000,
  "capacidad": 20,
  "alturaMinima": 100
}
\`\`\`

## Logging

Winston registra:
- Cada petición HTTP (vía Morgan) con nivel `info`
- Errores operacionales (`AppError`) con nivel `warn`
- Errores no controlados con nivel `error`, incluyendo stack trace

En producción (`NODE_ENV=production`), los errores además se guardan en `logs/error.log`.