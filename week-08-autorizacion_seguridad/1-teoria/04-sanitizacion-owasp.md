# 04 - Sanitización de Inputs y OWASP Top 10

## 🎯 Objetivos
- Entender la importancia de la sanitización de inputs
- Implementar sanitización para prevenir inyecciones
- Conocer las vulnerabilidades del OWASP Top 10
- Mitigar al menos 5 vulnerabilidades comunes

## 📚 Sanitización de Inputs

### ¿Qué es Sanitización?

**Sanitización** es el proceso de limpiar y validar los datos de entrada para eliminar caracteres peligrosos y prevenir ataques de inyección.

### ¿Por qué es necesaria?

Sin sanitización, tu API es vulnerable a:
- **NoSQL Injection**: Inyección de operadores MongoDB
- **XSS (Cross-Site Scripting)**: Inyección de scripts maliciosos
- **Command Injection**: Ejecución de comandos del sistema
- **Path Traversal**: Acceso a archivos no autorizados

## 🛡️ Tipos de Inyección

### 1. NoSQL Injection

**Vulnerabilidad**: Operadores MongoDB en inputs del usuario.

**Ejemplo de ataque**:
```json
{
  "email": { "$ne": null },
  "password": { "$ne": null }
}
```

Si no se sanitiza, esto podría devolver todos los usuarios.

**Prevención**:
```typescript
// ❌ VULNERABLE: Usar input directamente en query
const usuario = await Usuario.findOne(req.body);

// ✅ SEGURO: Sanitizar operadores MongoDB
const sanitizeMongo = (obj: any) => {
  const sanitized = { ...obj };
  for (const key in sanitized) {
    if (typeof sanitized[key] === "object") {
      delete sanitized[key];
    }
  }
  return sanitized;
};

const usuario = await Usuario.findOne(sanitizeMongo(req.body));
```

### 2. XSS (Cross-Site Scripting)

**Vulnerabilidad**: Inyección de scripts HTML/JavaScript.

**Ejemplo de ataque**:
```json
{
  "nombre": "<script>alert('XSS')</script>",
  "descripcion": "<img src=x onerror=alert('XSS')>"
}
```

**Prevención**:
```typescript
// ❌ VULNERABLE: Guardar input sin sanitizar
const atraccion = await Atraccion.create(req.body);

// ✅ SEGURO: Eliminar caracteres HTML peligrosos
const sanitizeXSS = (str: string) => {
  return str
    .replace(/[<>]/g, "")           // Eliminar < y >
    .replace(/javascript:/gi, "")   // Eliminar javascript:
    .replace(/onerror=/gi, "")      // Eliminar onerror=
    .trim();
};

const nombreSanitizado = sanitizeXSS(req.body.nombre);
const atraccion = await Atraccion.create({
  ...req.body,
  nombre: nombreSanitizado
});
```

### 3. Command Injection

**Vulnerabilidad**: Ejecución de comandos del sistema.

**Ejemplo de ataque**:
```bash
# Input malicioso
filename = "archivo.txt; rm -rf /"

# Si se ejecuta directamente
exec("cat " + filename)  # Ejecuta: cat archivo.txt; rm -rf /
```

**Prevención**:
```typescript
// ❌ VULNERABLE: Ejecutar comando directamente
import { exec } from "child_process";
exec("cat " + filename);  // Peligroso

// ✅ SECURO: Usar bibliotecas seguras o validar estrictamente
import fs from "fs";
fs.readFile(filename, "utf8");  // Seguro
```

## 🔧 Implementación con Zod

### Sanitización en Schemas

```typescript
import { z } from "zod";

// Función de sanitización
const sanitizeString = (val: string): string => {
  return val
    .replace(/[<>]/g, "")      // Eliminar caracteres HTML peligrosos
    .replace(/\$/g, "")        // Eliminar operadores MongoDB
    .trim();
};

const sanitizeNumber = (val: any): number => {
  const num = Number(val);
  if (isNaN(num) || num < 0) {
    throw new Error("Valor numerico invalido");
  }
  return num;
};

// Schema con sanitización
export const crearAtraccionSchema = z.object({
  nombre: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .transform(sanitizeString),  // Sanitizar después de validación
    
  descripcion: z.string()
    .min(10, "La descripcion debe tener al menos 10 caracteres")
    .max(500, "La descripcion no puede exceder 500 caracteres")
    .transform(sanitizeString),
    
  categoria: z.enum(["acceso", "montana_rusa", "acuario", "espectaculo", "comida"]),
  
  capacidad: z.number()
    .int("La capacidad debe ser un numero entero")
    .min(1, "La capacidad debe ser al menos 1")
    .max(1000, "La capacidad no puede exceder 1000")
    .transform(sanitizeNumber),  // Sanitizar números
    
  precio: z.number()
    .min(0, "El precio no puede ser negativo")
    .max(1000, "El precio no puede exceder 1000")
    .transform(sanitizeNumber)
});
```

### Middleware de Validación

```typescript
import { ZodType } from "zod";
import { AppError } from "../errors/AppError.js";

export function validate(schema: ZodType, target: "body" | "query" = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = target === "body" ? req.body : req.query;
    const resultado = schema.safeParse(data);
    
    if (!resultado.success) {
      const mensajes = resultado.error.issues.map((issue) => {
        const campo = issue.path.join(".");
        return campo + ": " + issue.message;
      });
      const error = new AppError(mensajes.join(" | "), 400, "VALIDATION_ERROR");
      return next(error);
    }
    
    // Usar datos sanitizados
    if (target === "body") {
      req.body = resultado.data;
    } else {
      req.query = resultado.data as any;
    }
    next();
  };
}
```

## 🎯 OWASP Top 10

### ¿Qué es OWASP Top 10?

Lista de las 10 vulnerabilidades de seguridad web más críticas, actualizada regularmente por la OWASP (Open Web Application Security Project).

### Vulnerabilidades y Mitigación

#### A01: Broken Access Control
**Descripción**: Fallas en el control de acceso permiten que usuarios no autorizados accedan a recursos o funciones.

**Ejemplo**: Usuario normal puede acceder a rutas de admin.

**Mitigación**:
```typescript
// ✅ Implementar RBAC correctamente
router.get("/admin/users", 
  requireAuth,           // 1. Verificar autenticación
  requireRole("admin"),  // 2. Verificar autorización
  adminController.listarUsuarios
);
```

#### A02: Cryptographic Failures
**Descripción**: Fallas relacionadas con criptografía, protector de datos sensibles.

**Ejemplo**: Almacenar passwords en texto plano.

**Mitigación**:
```typescript
// ✅ Hashear passwords con bcrypt
import bcrypt from "bcrypt";

const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// ✅ Usar HTTPS en producción
// ✅ Enviar tokens en cookies HttpOnly
res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict"
});
```

#### A03: Injection
**Descripción**: Inyección de código o comandos a través de inputs no validados.

**Ejemplo**: NoSQL injection, SQL injection, XSS.

**Mitigación**:
```typescript
// ✅ Sanitizar todos los inputs
const sanitizedInput = sanitizeString(req.body.nombre);

// ✅ Usar parámetros en lugar de concatenación
// ❌ MAL: collection.find({ name: req.body.name })
// ✅ BIEN: collection.find({ name: sanitizedInput })

// ✅ Validar con Zod
const validated = schema.parse(req.body);
```

#### A04: Insecure Design
**Descripción**: Fallas en el diseño de la arquitectura de seguridad.

**Ejemplo**: No implementar rate limiting permite ataques DDoS.

**Mitigación**:
```typescript
// ✅ Implementar rate limiting
app.use(generalLimiter);

// ✅ Diseñar con seguridad desde el inicio
// ✅ Considerar casos de ataque en el diseño
```

#### A05: Security Misconfiguration
**Descripción**: Configuraciones incorrectas o por defecto inseguras.

**Ejemplo**: No configurar cabeceras de seguridad.

**Mitigación**:
```typescript
// ✅ Usar Helmet para cabeceras seguras
app.use(helmet());

// ✅ Configurar CORS correctamente
app.use(cors({ origin: whitelist }));

// ✅ No exponer información sensible en errores
// ❌ MAL: res.send({ error: error.stack })
// ✅ BIEN: res.send({ error: "Internal server error" })
```

#### A06: Vulnerable and Outdated Components
**Descripción**: Uso de componentes con vulnerabilidades conocidas.

**Ejemplo**: Dependencias desactualizadas.

**Mitigación**:
```bash
# ✅ Auditoría de dependencias
npm audit

# ✅ Actualizar dependencias
npm update

# ✅ Usar versiones estables y recientes
```

#### A07: Identification and Authentication Failures
**Descripción**: Fallas en la identificación y autenticación de usuarios.

**Ejemplo**: Tokens JWT débiles, sesiones inseguras.

**Mitigación**:
```typescript
// ✅ Usar secretos fuertes para JWT
const JWT_SECRET = process.env.JWT_SECRET;  // Mínimo 32 caracteres

// ✅ Implementar expiración de tokens
jwt.sign(payload, secret, { expiresIn: "1h" });

// ✅ Usar cookies HttpOnly
res.cookie("token", token, { httpOnly: true });
```

#### A08: Software and Data Integrity Failures
**Descripción**: Fallas en la integridad de software y datos.

**Ejemplo**: No validar la integridad de datos recibidos.

**Mitigación**:
```typescript
// ✅ Validar todos los inputs
const validated = schema.parse(req.body);

// ✅ Usar checksums para archivos importantes
// ✅ Verificar firmas digitales
```

#### A09: Security Logging and Monitoring Failures
**Descripción**: Fallas en el logging y monitoreo de seguridad.

**Ejemplo**: No loggear eventos de seguridad.

**Mitigación**:
```typescript
// ✅ Loggear eventos de seguridad
logger.warn("Intento de login fallido", { ip: req.ip, email: req.body.email });
logger.error("Rate limit excedido", { ip: req.ip, endpoint: req.path });

// ✅ Monitorear patrones sospechosos
// ✅ Configurar alertas para eventos críticos
```

#### A10: Server-Side Request Forgery (SSRF)
**Descripción**: El servidor es forzado a hacer requests a recursos internos.

**Ejemplo**: Usuario puede hacer que el servidor acceda a `http://localhost:8080`.

**Mitigación**:
```typescript
// ✅ Validar y sanitizar URLs
const allowedDomains = ["api.externo.com"];
const url = new URL(req.body.url);

if (!allowedDomains.includes(url.hostname)) {
  throw new Error("Dominio no permitido");
}

// ✅ No permitir requests a localhost o IPs privadas
```

## 🧪 Testing de Sanitización

### Test de NoSQL Injection

```typescript
describe("Sanitización - NoSQL Injection", () => {
  it("debe rechazar operadores MongoDB", async () => {
    const maliciousInput = {
      nombre: "Test",
      email: { "$ne": null },
      password: { "$ne": null }
    };

    const response = await request(app)
      .post("/auth/register")
      .send(maliciousInput);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});
```

### Test de XSS

```typescript
describe("Sanitización - XSS", () => {
  it("debe eliminar caracteres HTML peligrosos", async () => {
    const maliciousInput = {
      nombre: "<script>alert('XSS')</script>",
      descripcion: "Normal description",
      categoria: "acceso",
      capacidad: 100,
      precio: 10
    };

    const response = await request(app)
      .post("/api/atracciones")
      .set("Cookie", `token=${adminToken}`)
      .send(maliciousInput);

    expect(response.status).toBe(201);
    expect(response.body.data.nombre).not.toContain("<script>");
    expect(response.body.data.nombre).not.toContain("<");
  });
});
```

## 🔒 Buenas Prácticas

### 1. Nunca Confiar en Inputs del Usuario

```typescript
// ❌ MAL: Usar input directamente
const usuario = await Usuario.findOne({ email: req.body.email });

// ✅ BIEN: Validar y sanitizar primero
const validated = loginSchema.parse(req.body);
const usuario = await Usuario.findOne({ email: validated.email });
```

### 2. Validar en Múltiples Capas

```typescript
// 1. Validación de schema (Zod)
router.post("/atracciones", validate(schema), ...);

// 2. Validación en service
async function crearAtraccion(datos) {
  if (datos.precio < 0) throw new Error("Precio invalido");
  // ...
}

// 3. Validación en modelo (Mongoose)
nombre: {
  type: String,
  required: true,
  minlength: 3
}
```

### 3. Usar Principio de Defensa en Profundidad

```typescript
// Múltiples capas de seguridad:
// 1. Sanitización de inputs
// 2. Validación de schemas
// 3. Autenticación
// 4. Autorización (RBAC)
// 5. Rate limiting
// 6. Cabeceras de seguridad (Helmet)
// 7. CORS configurado
```

## 📊 Resumen de Mitigaciones Implementadas

| Vulnerabilidad OWASP | Mitigación Implementada |
|---------------------|------------------------|
| A01: Broken Access Control | RBAC con `requireRole()` |
| A03: Injection | Sanitización de inputs con Zod |
| A04: Insecure Design | Rate limiting |
| A05: Security Misconfiguration | Helmet + CORS configurado |
| A07: Auth Failures | JWT + cookies HttpOnly |

## 🎯 Resumen

- **Sanitización**: Limpiar inputs para eliminar caracteres peligrosos
- **NoSQL Injection**: Eliminar operadores MongoDB (`$`)
- **XSS**: Eliminar caracteres HTML (`<`, `>`)
- **OWASP Top 10**: 10 vulnerabilidades más críticas
- **Mitigación**: Múltiples capas de seguridad
- **Validación**: Usar Zod para validación estricta

## 📖 Recursos Adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Input Validation](https://owasp.org/www-community/inputs_validation)
- [MDN XSS Prevention](https://developer.mozilla.org/en-US/docs/Web/Security/XSS)
- [Zod Documentation](https://zod.dev/)
