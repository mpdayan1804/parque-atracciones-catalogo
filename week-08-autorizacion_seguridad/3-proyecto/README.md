# Proyecto Semanal - Semana 8: Autorización y Seguridad

API del Parque de Atracciones implementando todas las capas de seguridad de la semana 8.

## 🎯 Características Implementadas

### ✅ RBAC (Role-Based Access Control)
- Middleware `requireAuth()` para verificar autenticación
- Middleware `requireRole()` para autorización por roles (`user`, `admin`)
- Rutas protegidas según el nivel de acceso requerido

### ✅ Helmet - Cabeceras HTTP de Seguridad
- CSP (Content Security Policy)
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options (protección contra clickjacking)
- X-Content-Type-Options
- Otras cabeceras de seguridad por defecto

### ✅ CORS - Cross-Origin Resource Sharing
- Configuración con whitelist de orígenes permitidos
- Soporte para credenciales (cookies)
- Métodos y headers permitidos configurados

### ✅ Rate Limiting
- Limitador general: 100 requests cada 15 minutos
- Limitador estricto: 5 requests cada 5 minutos (endpoints sensibles)
- Aplicado en endpoints de autenticación y operaciones críticas

### ✅ Sanitización de Inputs
- Prevención de XSS: eliminación de caracteres HTML peligrosos (`<`, `>`)
- Prevención de NoSQL injection: eliminación de operadores MongoDB (`$`)
- Validación con Zod para todos los inputs
- Transformación y limpieza de datos

## 🏗️ Arquitectura

```
src/
├── app.ts                 # Configuración de Express y middleware
├── server.ts              # Punto de entrada
├── config/
│   ├── cors.ts           # Configuración de CORS
│   └── db.ts             # Conexión a MongoDB
├── controllers/
│   ├── auth.controller.ts
│   ├── atraccion.controller.ts
│   └── visitante.controller.ts
├── middlewares/
│   ├── requireAuth.ts    # Middleware de autenticación
│   ├── requireRole.ts    # Middleware de autorización RBAC
│   ├── rateLimiter.ts    # Configuración de rate limiting
│   ├── validate.ts       # Validación con Zod
│   ├── errorHandler.ts   # Manejo global de errores
│   └── notFoundHandler.ts
├── models/
│   ├── Usuario.ts        # Modelo de usuarios con roles
│   ├── Atraccion.ts      # Modelo de atracciones
│   └── Visitante.ts      # Modelo de visitantes
├── repositories/
│   ├── usuario.repository.ts
│   ├── atraccion.repository.ts
│   └── visitante.repository.ts
├── services/
│   ├── auth.service.ts
│   ├── atraccion.service.ts
│   └── visitante.service.ts
├── routes/
│   ├── auth.routes.ts    # Rutas de autenticación
│   ├── atraccion.routes.ts # Rutas de atracciones con RBAC
│   └── visitante.routes.ts # Rutas de visitantes con RBAC
├── schemas/
│   ├── auth.schema.ts    # Validación y sanitización auth
│   ├── atraccion.schema.ts # Validación y sanitización atracciones
│   └── visitante.schema.ts # Validación y sanitización visitantes
├── utils/
│   └── jwt.ts            # Utilidades JWT
└── errors/
    └── AppError.ts       # Clase de errores personalizada
```

## 🔐 Endpoints y Seguridad

### Autenticación (`/auth`)
- `POST /auth/register` - Registro (público, rate limiting estricto)
- `POST /auth/login` - Login (público, rate limiting estricto)
- `GET /auth/me` - Obtener usuario actual (requiere auth)
- `POST /auth/logout` - Cerrar sesión (requiere auth)
- `GET /auth/users` - Listar usuarios (solo admin)
- `PATCH /auth/users/:id/role` - Cambiar rol (solo admin)

### Atracciones (`/api/atracciones`)
- `GET /api/atracciones` - Listar atracciones (requiere auth)
- `GET /api/atracciones/:id` - Obtener atracción (requiere auth)
- `GET /api/atracciones/categoria/:categoria` - Filtrar por categoría (requiere auth)
- `POST /api/atracciones` - Crear atracción (solo admin, rate limiting estricto)
- `PUT /api/atracciones/:id` - Actualizar atracción (solo admin)
- `DELETE /api/atracciones/:id` - Eliminar atracción (solo admin)

### Visitantes (`/api/visitantes`)
- `GET /api/visitantes` - Listar visitantes (requiere auth)
- `GET /api/visitantes/:id` - Obtener visitante (requiere auth)
- `GET /api/visitantes/fecha/:fecha` - Filtrar por fecha (requiere auth)
- `POST /api/visitantes` - Crear visitante (requiere auth, rate limiting estricto)
- `PUT /api/visitantes/:id` - Actualizar visitante (solo admin)
- `DELETE /api/visitantes/:id` - Eliminar visitante (solo admin)

## 🚀 Instalación y Ejecución

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
```
Editar `.env` con tus configuraciones:
```env
MONGODB_URI=mongodb://localhost:27017/parque_atracciones_seguridad
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_key_change_in_production
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

3. **Ejecutar en desarrollo:**
```bash
npm run dev
```

4. **Construir para producción:**
```bash
npm run build
npm start
```

## 🧪 Pruebas de Seguridad

### Probar RBAC
1. Registrar usuario normal:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","email":"juan@test.com","password":"Pass123!"}'
```

2. Intentar acceder a ruta de admin (debe fallar):
```bash
curl -X GET http://localhost:3000/auth/users \
  -H "Cookie: token=<token_del_usuario_normal>"
```

3. Crear usuario admin y probar acceso:
```bash
curl -X PATCH http://localhost:3000/auth/users/<id>/role \
  -H "Content-Type: application/json" \
  -H "Cookie: token=<token_admin>" \
  -d '{"role":"admin"}'
```

### Probar Rate Limiting
Hacer más de 5 requests en 5 minutos a `/auth/login` o `/auth/register` para ver el límite estricto en acción.

### Probar Helmet
Hacer una request y verificar las cabeceras de seguridad en la respuesta:
```bash
curl -I http://localhost:3000/
```

### Probar CORS
Intentar hacer una request desde un origen no permitido (debe ser rechazada).

### Probar Sanitización
Intentar enviar inputs con caracteres peligrosos:
```bash
curl -X POST http://localhost:3000/api/atracciones \
  -H "Content-Type: application/json" \
  -H "Cookie: token=<token_admin>" \
  -d '{"nombre":"<script>alert(1)</script>","descripcion":"test","categoria":"acceso","capacidad":100,"precio":10}'
```

## 📊 Vulnerabilidades OWASP Top 10 Mitigadas

1. **A01: Broken Access Control** - RBAC implementado correctamente
2. **A03: Injection** - Sanitización de inputs para NoSQL injection
3. **A05: Security Misconfiguration** - Helmet configura cabeceras seguras
4. **A07: Identification and Authentication Failures** - JWT con cookies HttpOnly
5. **A08: Software and Data Integrity Failures** - Validación estricta de inputs

## 🎓 Aprendizajes de la Semana 8

- **Diferencia entre autenticación y autorización**: Auth verifica quién eres, Authz qué puedes hacer
- **RBAC**: Control de acceso basado en roles usando middleware
- **Helmet**: Cabeceras HTTP de seguridad automatizadas
- **CORS**: Control de acceso entre orígenes diferentes
- **Rate Limiting**: Protección contra ataques de fuerza bruta y DDoS
- **Sanitización**: Limpieza de inputs para prevenir inyecciones
- **OWASP Top 10**: Principales vulnerabilidades web y cómo mitigarlas

## 📝 Notas de Desarrollo

- Todos los passwords hasheados con bcrypt (12 rounds)
- Tokens JWT con expiración de 1 hora
- Cookies HttpOnly y Secure en producción
- Validación de todos los inputs con Zod
- Logs de requests con Morgan
- Manejo centralizado de errores
- Tipado estricto con TypeScript

---

**Semana 8 completada exitosamente** ✅
