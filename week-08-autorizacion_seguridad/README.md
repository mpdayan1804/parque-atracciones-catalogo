# Semana 08 — Autorización y Seguridad

## 🎯 Objetivos de Aprendizaje

Al finalizar esta semana, el estudiante será capaz de:
- Implementar **RBAC** (Role-Based Access Control) con middleware `requireRole()`
- Aplicar **Helmet** para configurar cabeceras HTTP de seguridad
- Implementar **rate limiting** con `express-rate-limit` en endpoints públicos y de autenticación
- Configurar **CORS** correctamente para ambientes de desarrollo y producción
- Sanitizar inputs para prevenir **NoSQL injection** y **XSS**
- Entender la diferencia entre **autenticación** y **autorización**
- Identificar y mitigar al menos 5 vulnerabilidades del **OWASP Top 10**

## 📚 Requisitos Previos
- ✅ Semana 07 completa: `authMiddleware`, JWT, cookies HttpOnly
- ✅ Familiaridad con `req.user.role` desde el token decodificado
- ✅ Manejo de `AppError` y middleware global de errores

## 🗂️ Estructura de la Semana

```
week-08-autorizacion_seguridad/
├── README.md
├── 1-teoria/
│   ├── 01-rbac-autorizacion.md
│   ├── 02-helmet-headers.md
│   ├── 03-rate-limiting-cors.md
│   └── 04-sanitizacion-owasp.md
├── 2-practicas/
│   ├── ejercicio-01-rbac-roles/
│   └── ejercicio-02-helmet-cors-ratelimit/
├── 3-proyecto/
│   ├── README.md
│   ├── TESTING.md
│   └── [implementación completa]
├── 4-recursos/
│   ├── ebooks-free/
│   ├── videografia/
│   └── webgrafia/
└── 5-glosario/
```

## 📝 Contenidos

### Teoría

| Archivo | Tema | Descripción |
|---------|------|-------------|
| [01-rbac-autorizacion.md](1-teoria/01-rbac-autorizacion.md) | RBAC | Roles, permisos, `requireRole()`, diferencia auth/authz |
| [02-helmet-headers.md](1-teoria/02-helmet-headers.md) | Helmet | Cabeceras HTTP de seguridad: CSP, HSTS, X-Frame-Options |
| [03-rate-limiting-cors.md](1-teoria/03-rate-limiting-cors.md) | Rate Limiting y CORS | Throttling, opciones de CORS, whitelist de orígenes |
| [04-sanitizacion-owasp.md](1-teoria/04-sanitizacion-owasp.md) | Sanitización y OWASP | NoSQL injection, XSS, OWASP Top 10 en APIs REST |

### Prácticas

| Ejercicio | Tema | Descripción |
|----------|------|-------------|
| [ejercicio-01-rbac-roles](2-practicas/ejercicio-01-rbac-roles/) | RBAC | Implementar `requireRole()` y proteger rutas por rol |
| [ejercicio-02-helmet-cors-ratelimit](2-practicas/ejercicio-02-helmet-cors-ratelimit/) | Seguridad HTTP | Helmet + CORS + rate limiting en una API existente |

### Proyecto Semanal

**Dominio**: Parque de Atracciones con autenticación + autorización + capas de seguridad

**Implementación**:
- ✅ RBAC completo con roles `user` y `admin`
- ✅ Helmet configurado con todas las cabeceras de seguridad
- ✅ CORS con whitelist de orígenes
- ✅ Rate limiting general y estricto
- ✅ Sanitización de inputs para prevenir inyecciones
- ✅ Validación con Zod
- ✅ Mitigación de 5 vulnerabilidades OWASP Top 10

**Documentación**:
- [README.md](3-proyecto/README.md) - Documentación completa del proyecto
- [TESTING.md](3-proyecto/TESTING.md) - Guía paso a paso de testing

## ⏱️ Distribución del Tiempo (8 horas)

| Actividad | Tiempo |
|-----------|--------|
| Teoría (4 archivos) | 2h |
| Ejercicio 01: RBAC | 2h |
| Ejercicio 02: Helmet + CORS + Rate Limit | 2h |
| Proyecto semanal | 2h |

## 📌 Entregables

1. ✅ Ejercicio 01 funcionando: API con roles `user` y `admin`, rutas diferenciadas
2. ✅ Ejercicio 02 funcionando: cabeceras de seguridad, CORS configurado, rate limiting activo
3. ✅ Proyecto semanal: dominio asignado con autenticación + autorización + capas de seguridad

## 🚀 Cómo Empezar

### 1. Revisar la Teoría
Comienza leyendo los archivos de teoría en orden:
1. `01-rbac-autorizacion.md` - Fundamentos de autorización
2. `02-helmet-headers.md` - Cabeceras de seguridad
3. `03-rate-limiting-cors.md` - Rate limiting y CORS
4. `04-sanitizacion-owasp.md` - Sanitización y OWASP

### 2. Completar los Ejercicios
Trabaja en los ejercicios prácticos en orden:
1. `ejercicio-01-rbac-roles` - Implementar RBAC
2. `ejercicio-02-helmet-cors-ratelimit` - Implementar seguridad HTTP

### 3. Desarrollar el Proyecto
Implementa el proyecto semanal integrando todos los conceptos:
- Autenticación JWT
- Autorización RBAC
- Seguridad con Helmet
- CORS configurado
- Rate limiting
- Sanitización de inputs

### 4. Probar Todo
Sigue la guía de testing en `3-proyecto/TESTING.md` para verificar que todo funciona correctamente.

## 🧪 Testing

Para probar tu implementación, sigue la guía completa en:
[3-proyecto/TESTING.md](3-proyecto/TESTING.md)

**Principales pruebas**:
- ✅ Verificar cabeceras de seguridad (Helmet)
- ✅ Probar RBAC (autenticación y autorización)
- ✅ Verificar rate limiting
- ✅ Probar CORS
- ✅ Verificar sanitización de inputs
- ✅ Probar todos los endpoints

## 🎯 Conceptos Clave

### Autenticación vs Autorización
- **Autenticación**: ¿Quién eres? (JWT, sesiones)
- **Autorización**: ¿Qué puedes hacer? (RBAC, permisos)

### RBAC (Role-Based Access Control)
- Control de acceso basado en roles
- Middleware `requireAuth()` y `requireRole()`
- Jerarquía de roles: admin > user > guest

### Helmet
- Middleware para cabeceras de seguridad
- CSP, HSTS, X-Frame-Options, etc.
- Configuración automática y personalizable

### Rate Limiting
- Limitar requests por cliente
- Prevenir DDoS y brute force
- Configuración general y específica

### CORS
- Controlar requests cross-origin
- Whitelist de orígenes permitidos
- Configuración por ambiente

### Sanitización
- Limpiar inputs de caracteres peligrosos
- Prevenir NoSQL injection y XSS
- Validación con Zod

### OWASP Top 10
- 10 vulnerabilidades más críticas
- Mitigación con múltiples capas de seguridad
- Defensa en profundidad

## 📊 Checklist de Completación

### Teoría
- [ ] Leído y comprendido RBAC y autorización
- [ ] Leído y comprendido Helmet y cabeceras de seguridad
- [ ] Leído y comprendido Rate limiting y CORS
- [ ] Leído y comprendido Sanitización y OWASP

### Prácticas
- [ ] Ejercicio 01 completado y funcionando
- [ ] Ejercicio 02 completado y funcionando
- [ ] Proyecto semanal completado y funcionando

### Testing
- [ ] Todas las pruebas de seguridad pasan
- [ ] RBAC funciona correctamente
- [ ] Rate limiting funciona correctamente
- [ ] CORS está configurado correctamente
- [ ] Sanitización de inputs funciona
- [ ] Compilación sin errores

## 🔗 Recursos Adicionales

### Documentación
- [Helmet Documentation](https://helmetjs.github.io/)
- [express-rate-limit](https://github.com/nfriedly/express-rate-limit)
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

### Herramientas
- [Security Headers](https://securityheaders.com/) - Verificar cabeceras
- [OWASP ZAP](https://www.zaproxy.org/) - Scanner de vulnerabilidades
- [Postman](https://www.postman.com/) - Testing de APIs

### Recursos de la Semana
- [Recursos Web](4-recursos/webgrafia/recursos-seguridad.md)
- [Glosario](5-glosario/glosario.md)

## 🎓 Aprendizajes Esperados

Al completar esta semana, deberías ser capaz de:

1. **Implementar RBAC**: Crear middlewares de autorización basados en roles
2. **Configurar seguridad**: Usar Helmet para cabeceras de seguridad
3. **Controlar accesos**: Configurar CORS y rate limiting
4. **Prevenir inyecciones**: Sanitizar inputs correctamente
5. **Identificar vulnerabilidades**: Conocer el OWASP Top 10
6. **Aplicar defensa en profundidad**: Múltiples capas de seguridad

## 📞 Soporte

Si tienes problemas durante esta semana:
1. Revisa la guía de testing en `3-proyecto/TESTING.md`
2. Consulta los recursos en `4-recursos/webgrafia/`
3. Revisa el glosario en `5-glosario/`
4. Revisa los ejercicios prácticos para referencia

## 🔗 Navegación

← [Semana 07: Autenticación JWT](../week-07-autenticacion_jwt/README.md) | [Semana 09: Testing →](../week-09-testing/README.md)

---

**¡Buena suerte con la semana 8!** 🚀
