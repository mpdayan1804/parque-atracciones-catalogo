# 02 - Helmet y Cabeceras HTTP de Seguridad

## 🎯 Objetivos
- Entender la importancia de las cabeceras HTTP de seguridad
- Configurar Helmet en Express.js
- Conocer las principales cabeceras de seguridad

## 📚 ¿Qué es Helmet?

**Helmet** es un middleware para Express.js que configura automáticamente varias cabeceras HTTP de seguridad para proteger tu aplicación contra vulnerabilidades web comunes.

### ¿Por qué es necesario?

Las cabeceras HTTP son el primer nivel de defensa de tu aplicación. Sin ellas, tu API es vulnerable a:
- Clickjacking
- XSS (Cross-Site Scripting)
- MITM (Man-in-the-Middle) attacks
- Sniffing de datos
- Falsificación de requests

## 🛡️ Cabeceras Configuradas por Helmet

### 1. Content-Security-Policy (CSP)

**Propósito**: Controla qué recursos pueden cargar el navegador.

**Protege contra**: XSS, data injection

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.example.com
```

**Configuración en Helmet**:
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.example.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  }
}));
```

**Directivas Importantes**:
- `default-src`: Política por defecto para todos los tipos
- `script-src`: Fuentes de JavaScript permitidas
- `style-src`: Fuentes de CSS permitidas
- `img-src`: Fuentes de imágenes permitidas
- `connect-src`: Orígenes para AJAX/WebSocket

### 2. X-Frame-Options

**Propósito**: Previene clickjacking prohibiendo que tu sitio sea incrustado en frames.

**Protege contra**: Clickjacking

```http
X-Frame-Options: DENY
```

**Valores**:
- `DENY`: Prohibe cualquier framing
- `SAMEORIGIN`: Permite framing solo del mismo origen

**Configuración**:
```typescript
app.use(helmet({
  frameguard: {
    action: "deny"  // o "sameorigin"
  }
}));
```

### 3. X-Content-Type-Options

**Propósito**: Previene MIME-sniffing, obligando al navegador a respetar el Content-Type declarado.

**Protege contra**: MIME-sniffing attacks

```http
X-Content-Type-Options: nosniff
```

**Configuración**:
```typescript
app.use(helmet({
  noSniff: true
}));
```

### 4. Strict-Transport-Security (HSTS)

**Propósito**: Fuerza conexiones HTTPS por un período especificado.

**Protege contra**: MITM attacks, protocol downgrade

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

**Configuración**:
```typescript
app.use(helmet({
  hsts: {
    maxAge: 31536000,  // 1 año en segundos
    includeSubDomains: true,
    preload: true
  }
}));
```

**⚠️ Importante**: Solo habilitar HSTS si tienes HTTPS configurado correctamente.

### 5. X-XSS-Protection

**Propósito**: Activa el filtro XSS del navegador (obsoleto pero aún soportado).

**Protege contra**: XSS

```http
X-XSS-Protection: 1; mode=block
```

**Configuración**:
```typescript
app.use(helmet({
  xssFilter: true
}));
```

### 6. Referrer-Policy

**Propósito**: Controla qué información del referer se envía en las requests.

**Protege contra**: Information leakage

```http
Referrer-Policy: strict-origin-when-cross-origin
```

**Valores**:
- `no-referrer`: No envía referer
- `strict-origin-when-cross-origin`: Solo envía origen para cross-origin
- `same-origin`: Solo envía para same-origin

**Configuración**:
```typescript
app.use(helmet({
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin"
  }
}));
```

### 7. Permissions-Policy

**Propósito**: Controla qué APIs/features del navegador puede usar el sitio.

**Protege contra**: Abuso de APIs del navegador

```http
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Configuración**:
```typescript
app.use(helmet({
  permissionsPolicy: {
    features: {
      geolocation: ["'none'"],
      microphone: ["'none'"],
      camera: ["'none'"],
      payment: ["'none'"]
    }
  }
}));
```

## 🚀 Configuración Básica

### Configuración por Defecto (Recomendada)

```typescript
import helmet from "helmet";

// Configuración básica con valores por defecto seguros
app.use(helmet());
```

Esto habilita todas las protecciones con valores razonables por defecto.

### Configuración Personalizada

```typescript
import helmet from "helmet";

app.use(helmet({
  // CSP personalizada
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  
  // HSTS solo en producción
  hsts: process.env.NODE_ENV === "production" ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  } : false,
  
  // Deshabilitar X-XSS-Protection si usas CSP fuerte
  xssFilter: false
}));
```

## 🔍 Verificación de Cabeceras

### Método 1: Curl

```bash
curl -I http://localhost:3000/
```

**Respuesta esperada**:
```http
HTTP/1.1 200 OK
X-DNS-Prefetch-Control: off
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Download-Options: noopen
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Referrer-Policy: no-referrer
```

### Método 2: Browser DevTools

1. Abre DevTools (F12)
2. Ve a la pestaña "Network"
3. Haz una request a tu API
4. Revisa las cabeceras de respuesta

### Método 3: Security Headers Scanner

Usa herramientas como:
- [Security Headers](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

## 🎯 Buenas Prácticas

### 1. Usar Helmet en Desarrollo y Producción

```typescript
// Siempre habilitar helmet
app.use(helmet());

// No deshabilitar en desarrollo
// app.use(helmet({ contentSecurityPolicy: false })); // ❌
```

### 2. Configurar CSP Apropiadamente

```typescript
// ❌ MAL: CSP demasiado permisiva
contentSecurityPolicy: {
  directives: {
    defaultSrc: ["*"]
  }
}

// ✅ BIEN: CSP específica y restrictiva
contentSecurityPolicy: {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://trusted-cdn.com"]
  }
}
```

### 3. HSTS Solo con HTTPS

```typescript
// ✅ BIEN: HSTS solo en producción con HTTPS
hsts: process.env.NODE_ENV === "production" && process.env.HTTPS === "true" ? {
  maxAge: 31536000,
  includeSubDomains: true
} : false
```

### 4. Revisar Cabeceras Regularmente

```typescript
// Middleware para loggear cabeceras (solo desarrollo)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function(data) {
      console.log("Security Headers:", res.getHeaders());
      return originalSend.call(this, data);
    };
    next();
  });
}
```

## 📊 Impacto en OWASP Top 10

Helmet mitiga varias vulnerabilidades del OWASP Top 10:

- **A03: Injection** - CSP previene inyección de scripts
- **A05: Security Misconfiguration** - Cabeceras por defecto seguras
- **A07: Identification and Authentication Failures** - HSTS previene downgrade
- **A08: Software and Data Integrity Failures** - X-Frame-Options previene clickjacking

## 🧪 Testing

### Test de Cabeceras de Seguridad

```typescript
import request from "supertest";
import app from "../app.js";

describe("Security Headers", () => {
  it("debe incluir X-Frame-Options", async () => {
    const response = await request(app).get("/");
    expect(response.headers["x-frame-options"]).toBeDefined();
  });

  it("debe incluir X-Content-Type-Options", async () => {
    const response = await request(app).get("/");
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
  });

  it("debe incluir CSP en producción", async () => {
    process.env.NODE_ENV = "production";
    const response = await request(app).get("/");
    expect(response.headers["content-security-policy"]).toBeDefined();
  });
});
```

## 🎯 Resumen

- **Helmet**: Middleware que configura cabeceras de seguridad automáticamente
- **CSP**: Controla qué recursos pueden cargar
- **HSTS**: Fuerza HTTPS
- **X-Frame-Options**: Previene clickjacking
- **Configuración**: Usar valores por defecto y personalizar según necesidad
- **Verificación**: Revisar cabeceras regularmente con herramientas de seguridad

## 📖 Recursos Adicionales

- [Helmet Documentation](https://helmetjs.github.io/)
- [MDN CSP Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP Secure Headers](https://owasp.org/www-project-secure-headers/)
