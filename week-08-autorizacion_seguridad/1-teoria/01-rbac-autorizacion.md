# 01 - RBAC y Autorización

## 🎯 Objetivos
- Entender la diferencia entre autenticación y autorización
- Implementar RBAC (Role-Based Access Control)
- Crear middleware `requireRole()` para protección de rutas

## 📚 Conceptos Fundamentales

### Autenticación vs Autorización

**Autenticación (AuthN)**
- **Pregunta**: ¿Quién eres?
- **Verifica**: Identidad del usuario
- **Métodos**: JWT, sesiones, OAuth, etc.
- **Resultado**: Usuario autenticado o no

**Autorización (AuthZ)**
- **Pregunta**: ¿Qué puedes hacer?
- **Verifica**: Permisos del usuario
- **Métodos**: RBAC, ABAC, ACL, etc.
- **Resultado**: Acceso permitido o denegado

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Usuario   │ ───> │ AuthN (JWT) │ ───> │  AuthZ (RBAC) │
│  credentials│      │   ¿Quién?   │      │   ¿Qué?     │
└─────────────┘      └─────────────┘      └─────────────┘
                           │                      │
                           ▼                      ▼
                    Token válido          Rol: admin/user
                           │                      │
                           └──────────┬───────────┘
                                      ▼
                              Acceso a recursos
```

## 🔐 RBAC (Role-Based Access Control)

### Definición
Sistema de control de acceso basado en roles donde los permisos se asignan a roles, y los roles se asignan a usuarios.

### Ventajas
- **Simplicidad**: Fácil de entender y mantener
- **Escalabilidad**: Fácil agregar nuevos roles
- **Auditoría**: Simple rastrear quién hizo qué
- **Mantenimiento**: Cambios centralizados en roles

### Modelo de Datos

```typescript
// Usuario con rol
interface Usuario {
  id: string;
  nombre: string;
  email: string;
  role: "user" | "admin";  // Rol del usuario
}

// Roles y permisos
const ROLES = {
  user: {
    can: ["read:atracciones", "read:visitantes", "create:visitantes"]
  },
  admin: {
    can: ["*"]  // Acceso total
  }
};
```

## 🛠️ Implementación

### Middleware `requireAuth()`
Verifica que el usuario esté autenticado (tiene token válido).

```typescript
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  
  if (!token) {
    return next(AppError.unauthorized("No proporcionaste token"));
  }

  try {
    const decoded = verifyToken(token);
    req.usuario = decoded;  // Adjuntar usuario al request
    next();
  } catch (error) {
    return next(AppError.unauthorized("Token invalido"));
  }
}
```

### Middleware `requireRole()`
Verifica que el usuario tenga el rol necesario.

```typescript
export function requireRole(...rolesPermitidos: Array<"user" | "admin">) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      return next(AppError.unauthorized("No autenticado"));
    }

    if (!rolesPermitidos.includes(req.usuario.role)) {
      return next(AppError.forbidden("No tienes permisos"));
    }

    next();
  };
}
```

### Uso en Rutas

```typescript
// Ruta pública (cualquiera)
router.get("/public", (req, res) => {
  res.json({ mensaje: "Acceso publico" });
});

// Ruta protegida (requiere autenticación)
router.get("/privado", requireAuth, (req, res) => {
  res.json({ mensaje: "Solo usuarios autenticados" });
});

// Ruta solo para admin
router.get("/admin", requireAuth, requireRole("admin"), (req, res) => {
  res.json({ mensaje: "Solo administradores" });
});

// Ruta para user o admin
router.get("/usuarios", requireAuth, requireRole("user", "admin"), (req, res) => {
  res.json({ mensaje: "Usuarios autenticados" });
});
```

## 📊 Jerarquía de Roles

```
                 ADMIN
                /     \
               /       \
          USER          GUEST
           |
           |
        PUBLIC
```

**ADMIN**: Acceso total a todo el sistema
**USER**: Acceso limitado a recursos propios y lectura
**GUEST**: Solo lectura de recursos públicos
**PUBLIC**: Sin autenticación requerida

## 🔒 Buenas Prácticas

### 1. Principio de Mínimo Privilegio
```typescript
// ❌ MAL: Dar acceso total innecesariamente
router.get("/usuarios", requireAuth, requireRole("admin"), ...);

// ✅ BIEN: Solo dar acceso necesario
router.get("/mi-perfil", requireAuth, ...);  // Solo autenticación
router.get("/usuarios", requireAuth, requireRole("admin"), ...);  // Solo admin
```

### 2. Validación en Varios Niveles
```typescript
// Middleware + Service + Database
router.delete("/usuarios/:id", 
  requireAuth,              // 1. Verificar autenticación
  requireRole("admin"),     // 2. Verificar autorización
  validate(deleteSchema),   // 3. Validar input
  authController.eliminar  // 4. Lógica de negocio
);
```

### 3. Auditoría de Acciones
```typescript
// Log de acciones sensibles
router.patch("/usuarios/:id/role", 
  requireAuth, 
  requireRole("admin"),
  async (req, res) => {
    await logAuditoria({
      accion: "CAMBIO_ROL",
      usuario: req.usuario.id,
      target: req.params.id,
      nuevoRol: req.body.role
    });
    // ...
  }
);
```

## 🧪 Testing de RBAC

### Casos de Prueba

1. **Usuario no autenticado** intenta acceder a ruta protegida
   - Expected: 401 Unauthorized

2. **Usuario con rol incorrecto** intenta acceder a ruta admin
   - Expected: 403 Forbidden

3. **Usuario con rol correcto** accede a ruta permitida
   - Expected: 200 OK

4. **Admin** accede a ruta de cualquier rol
   - Expected: 200 OK

### Ejemplo de Test

```typescript
describe("RBAC Middleware", () => {
  it("debe denegar acceso a usuario no autenticado", async () => {
    const response = await request(app)
      .get("/api/atracciones")
      .expect(401);
    
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });

  it("debe denegar acceso a user en ruta admin", async () => {
    const token = await loginAsUser();
    const response = await request(app)
      .get("/auth/users")
      .set("Cookie", `token=${token}`)
      .expect(403);
    
    expect(response.body.error.code).toBe("FORBIDDEN");
  });
});
```

## 🎯 Resumen

- **AuthN**: Verifica identidad (quién eres)
- **AuthZ**: Verifica permisos (qué puedes hacer)
- **RBAC**: Control de acceso basado en roles
- **Middleware**: `requireAuth()` y `requireRole()`
- **Principio**: Mínimo privilegio necesario

## 📖 Recursos Adicionales

- [OWASP Access Control](https://owasp.org/www-project-top-ten/)
- [NIST RBAC Standard](https://csrc.nist.gov/projects/role-based-access-control)
- [OAuth 2.0 and RBAC](https://oauth.net/2/)
