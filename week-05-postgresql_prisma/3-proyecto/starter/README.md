# API CRUD con PostgreSQL + Prisma — Parque de Atracciones (Semana 5)

API REST construida con Express 5, TypeScript y Prisma ORM sobre PostgreSQL (corriendo en Docker), extendiendo la arquitectura en capas y el manejo de errores de semanas anteriores.

## Novedades sobre la Semana 4

- **PostgreSQL real** en un contenedor Docker (`docker-compose.yml`), reemplazando el array en memoria
- **Prisma ORM** — `schema.prisma` define el modelo `Atraccion`, migraciones versionadas en `prisma/migrations/`
- **Seed** (`prisma/seed.ts`) — carga datos iniciales reales en la base de datos
- **Repositorio async** — todas las operaciones son queries reales a Postgres vía Prisma Client
- **Manejo de errores de Prisma** — `P2025` (no encontrado) → 404, `P2002` (valor duplicado) → 409

## Requisitos

- Docker Desktop corriendo
- Node.js + pnpm

## Instalación y arranque

\`\`\`bash
# 1. Instalar dependencias
pnpm install

# 2. Levantar PostgreSQL en Docker
docker compose up -d

# 3. Aplicar migraciones (crea las tablas)
npx prisma migrate dev

# 4. Cargar datos iniciales
pnpm prisma:seed

# 5. Arrancar el servidor
pnpm dev
\`\`\`

Servidor disponible en `http://localhost:3000`

## Variables de entorno

Archivo `.env` (no se sube a git):

\`\`\`
DATABASE_URL="postgresql://parque_user:parque_pass@localhost:5432/parque_atracciones?schema=public"
\`\`\`

## Modelo de datos

\`\`\`prisma
model Atraccion {
  id            Int       @id @default(autoincrement())
  nombre        String
  categoria     Categoria
  precio        Float
  capacidad     Int
  alturaMinima  Int       @default(0)
  activa        Boolean   @default(true)
  creadoEn      DateTime  @default(now())
  actualizadoEn DateTime  @updatedAt
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

## Manejo de errores de Prisma

| Código Prisma | Status HTTP | Code de respuesta | Descripción                          |
|----------------|-------------|--------------------|----------------------------------------|
| P2025          | 404         | NOT_FOUND          | Registro no encontrado (update/delete)|
| P2002          | 409         | CONFLICT           | Violación de restricción única        |
| (Zod inválido) | 400         | VALIDATION_ERROR   | Datos de entrada no cumplen el schema |

## Herramientas útiles

\`\`\`bash
npx prisma studio       # Interfaz visual para ver/editar datos (localhost:5555)
npx prisma migrate dev  # Crear y aplicar una nueva migración
docker compose down     # Detener el contenedor de Postgres
docker compose up -d    # Levantar el contenedor de nuevo
\`\`\`