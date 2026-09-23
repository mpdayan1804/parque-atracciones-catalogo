# 03 - Rate Limiting y CORS

## 🎯 Objetivos
- Entender qué es Rate Limiting y por qué es necesario
- Configurar `express-rate-limit` en Express.js
- Configurar CORS correctamente para diferentes ambientes
- Entender los riesgos de configuración incorrecta de CORS

## 📚 Rate Limiting

### ¿Qué es Rate Limiting?

**Rate Limiting** es una técnica que limita la cantidad de requests que un cliente puede hacer a tu API en un período de tiempo específico.

### ¿Por qué es necesario?

Sin rate limiting, tu API es vulnerable a:
- **DDoS attacks**: Ataques de denegación de servicio
- **Brute force attacks**: Fuerza bruta en credenciales
- **API abuse**: Abuso de recursos por usuarios
- **Cost escalation**: Costos excesivos en servicios pagos

### Tipos de Rate Limiting

#### 1. Rate Limiting General
Aplica a toda la API, sin distinción de endpoint.

```typescript
import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  limit: 100,                 // 100 requests por ventana
  standardHeaders: true,      // Send rate limit info in headers
  legacyHeaders: false,       // Disable X-RateLimit-* headers
  message: {
    success: false,
    error: {
      message: "Demasiadas solicitudes, intenta de nuevo mas tarde",
      code: "TOO_MANY_REQUESTS"
    }
  }
});
```

#### 2. Rate Limiting Específico
Aplica solo a endpoints sensibles (login, registro, etc.).

```typescript
export const strictLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,   // 5 minutos
  limit: 5,                   // 5 requests por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Limite de solicitudes excedido para esta accion",
      code: "TOO_MANY_REQUESTS"
    }
  }
});
```

#### 3. Rate Limiting por IP
Limita requests por dirección IP.

```typescript
export const ipLimiter = rateLimit({
  windowMs: 60 * 1000,        // 1 minuto
  limit: 30,                  // 30 requests por IP
  keyGenerator: (req) => req.ip,
  standardHeaders: true
});
```

#### 4. Rate Limiting por Usuario
Limita requests por usuario autenticado.

```typescript
export const userLimiter = rateLimit({
  windowMs: 60 * 1000,        // 1 minuto
  limit: 100,                 // 100 requests por usuario
  keyGenerator: (req: AuthRequest) => req.usuario?.id || req.ip,
  skip: (req) => !req.usuario,  // Solo para usuarios autenticados
  standardHeaders: true
});
```

### Uso en Express

```typescript
import express from "express";
import { generalLimiter, strictLimiter } from "./middlewares/rateLimiter.js";

const app = express();

// Aplicar a toda la API
app.use(generalLimiter);

// Aplicar a endpoints específicos
app.post("/auth/login", strictLimiter, authController.login);
app.post("/auth/register", strictLimiter, authController.register);

// Rutas normales usan el limitador general
app.get("/api/atracciones", atraccionController.listar);
```

### Cabeceras de Rate Limiting

Cuando se excede el límite, Express envía estas cabeceras:

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1634567890
Retry-After: 300
```

- `X-RateLimit-Limit`: Límite total de requests
- `X-RateLimit-Remaining`: Requests restantes
- `X-RateLimit-Reset`: Timestamp cuando se resetea el límite
- `Retry-After`: Segundos antes de intentar de nuevo

## 🌐 CORS (Cross-Origin Resource Sharing)

### ¿Qué es CORS?

**CORS** es un mecanismo de seguridad que permite o restringe requests cross-origin (desde un dominio diferente) a tu API.

### ¿Por qué es necesario?

La **Same-Origin Policy** del navegador previene que una página web haga requests a un dominio diferente por defecto. CORS permite controlar esto de forma segura.

### Funcionamiento de CORS

```
┌─────────────┐                 ┌─────────────┐
│   Browser   │                 │   API       │
│  (origin A) │                 │  (origin B) │
└──────┬──────┘                 └──────┬──────┘
       │                               │
       │  1. OPTIONS preflight         │
       │  ──────────────────────────> │
       │                               │
       │  2. Response con cabeceras    │
       │  <──────────────────────────  │
       │                               │
       │  3. Request real              │
       │  ──────────────────────────> │
       │                               │
       │  4. Response con datos       │
       │  <──────────────────────────  │
       │                               │
```

### Configuración de CORS

#### Configuración Básica

```typescript
import cors from "cors";

// Permitir todos los orígenes (no recomendado en producción)
app.use(cors());
```

#### Configuración con Whitelist

```typescript
import cors from "cors";

const origenesPermitidos = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origen) => origen.trim())
  .filter(Boolean);

export const corsOptions = {
  origin(origen: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origen) {
      return callback(null, true);  // Permitir requests sin origen (ej: mobile apps)
    }

    if (origenesPermitidos.includes(origen)) {
      return callback(null, true);
    }

    callback(new Error("Origen no permitido por CORS: " + origen));
  },
  credentials: true,           // Permitir cookies
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400               // Cache preflight por 24 horas
};

app.use(cors(corsOptions));
```

#### Configuración por Ambiente

```typescript
const corsOptions = {
  origin: process.env.NODE_ENV === "production" 
    ? ["https://mi-frontend.com", "https://admin.mi-frontend.com"]
    : ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
};
```

### Preflight Requests

Para requests que no son "simple", el navegador hace primero una request OPTIONS:

```http
OPTIONS /api/atracciones HTTP/1.1
Origin: http://localhost:5173
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

Response:
```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

### Configuración de Variables de Entorno

```env
# Desarrollo
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Producción
CORS_ORIGINS=https://mi-frontend.com,https://admin.mi-frontend.com
```

## 🔒 Buenas Prácticas

### Rate Limiting

1. **Limitar Endpoints Sensibles**
```typescript
// ✅ BIEN: Rate limiting estricto en auth
app.post("/auth/login", strictLimiter, authController.login);
app.post("/auth/register", strictLimiter, authController.register);

// ✅ BIEN: Rate limiting moderado en API general
app.use(generalLimiter);
```

2. **Mensajes Claros**
```typescript
// ✅ BIEN: Mensaje informativo
message: {
  success: false,
  error: {
    message: "Demasiadas solicitudes. Intenta de nuevo en 5 minutos.",
    code: "TOO_MANY_REQUESTS"
  }
}
```

3. **Monitorear Rate Limiting**
```typescript
// Middleware para loggear excesos
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function(data) {
    if (res.statusCode === 429) {
      console.warn(`Rate limit excedido: ${req.ip} - ${req.method} ${req.path}`);
    }
    return originalSend.call(this, data);
  };
  next();
});
```

### CORS

1. **Usar Whitelist Estricta**
```typescript
// ❌ MAL: Permitir todos los orígenes
app.use(cors());

// ✅ BIEN: Whitelist específica
app.use(cors({ origin: origenesPermitidos }));
```

2. **Configurar Credenciales Correctamente**
```typescript
// ✅ BIEN: Habilitar credenciales solo si es necesario
corsOptions = {
  origin: origenesPermitidos,
  credentials: true  // Requerido para cookies HttpOnly
}
```

3. **Configurar por Ambiente**
```typescript
// ✅ BIEN: Configuración diferente por ambiente
const corsOptions = {
  origin: process.env.NODE_ENV === "production"
    ? productionOrigins
    : developmentOrigins
};
```

## 🧪 Testing

### Test de Rate Limiting

```typescript
import request from "supertest";
import app from "../app.js";

describe("Rate Limiting", () => {
  it("debe limitar requests excesivos", async () => {
    const promises = Array(10).fill(null).map(() =>
      request(app).post("/auth/login").send({ email: "test@test.com", password: "test" })
    );

    const responses = await Promise.all(promises);
    const rateLimited = responses.filter(r => r.status === 429);
    
    expect(rateLimited.length).toBeGreaterThan(0);
  });

  it("debe incluir cabeceras de rate limit", async () => {
    const response = await request(app).get("/");
    
    expect(response.headers["x-ratelimit-limit"]).toBeDefined();
    expect(response.headers["x-ratelimit-remaining"]).toBeDefined();
  });
});
```

### Test de CORS

```typescript
describe("CORS", () => {
  it("debe permitir orígenes en whitelist", async () => {
    const response = await request(app)
      .get("/")
      .set("Origin", "http://localhost:5173");
    
    expect(response.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
  });

  it("debe rechazar orígenes no permitidos", async () => {
    const response = await request(app)
      .get("/")
      .set("Origin", "http://malicious.com");
    
    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });
});
```

## 📊 Impacto en OWASP Top 10

- **A04: Insecure Design** - Rate limiting previene abuso de diseño
- **A05: Security Misconfiguration** - CORS proper configuration
- **A07: Identification and Authentication Failures** - Rate limiting previene brute force

## 🎯 Resumen

### Rate Limiting
- **Propósito**: Limitar cantidad de requests por cliente
- **Tipos**: General, específico, por IP, por usuario
- **Configuración**: Diferentes límites para diferentes endpoints
- **Monitoreo**: Loggear excesos para detectar ataques

### CORS
- **Propósito**: Controlar requests cross-origin
- **Configuración**: Whitelist de orígenes permitidos
- **Credenciales**: Habilitar solo si es necesario
- **Ambientes**: Configuración diferente por ambiente

## 📖 Recursos Adicionales

- [express-rate-limit Documentation](https://github.com/nfriedly/express-rate-limit)
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP Rate Limiting](https://owasp.org/www-community/controls/Rate_Limiting)
