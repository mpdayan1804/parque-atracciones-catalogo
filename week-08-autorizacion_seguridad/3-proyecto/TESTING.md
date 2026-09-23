# 🧪 Guía de Testing - Semana 8

## 📋 Requisitos Previos

1. **MongoDB** ejecutándose localmente o en la nube
2. **Node.js** instalado
3. Dependencias instaladas: `npm install`

## 🚀 Paso 1: Configuración

### 1.1 Instalar Dependencias
```bash
cd "parque-atracciones-catalogo-clon/week-08-autorizacion_seguridad/3-proyecto"
npm install
```

### 1.2 Configurar Variables de Entorno
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tu configuración
```

**Contenido de `.env`**:
```env
MONGODB_URI=mongodb://localhost:27017/parque_atracciones_seguridad
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_key_change_in_production_min_32_chars
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 1.3 Verificar MongoDB
```bash
# Si usas MongoDB local
mongosh
# Deberías ver el prompt de MongoDB

# O verificar que el puerto esté escuchando
netstat -an | findstr 27017  # Windows
lsof -i :27017               # Mac/Linux
```

## 🔥 Paso 2: Ejecutar el Servidor

### 2.1 Modo Desarrollo
```bash
npm run dev
```

Deberías ver:
```
Conectado a MongoDB
Servidor corriendo en puerto 3000
```

### 2.2 Verificar que el Servidor Responde
```bash
curl http://localhost:3000/
```

**Respuesta esperada**:
```json
{
  "mensaje": "API del Parque de Atracciones - Semana 8: Autorización y Seguridad",
  "version": "1.0.0",
  "features": [
    "RBAC (Role-Based Access Control)",
    "Helmet para cabeceras de seguridad",
    "CORS configurado",
    "Rate Limiting",
    "Sanitización de inputs"
  ],
  "endpoints": {
    "auth": "/auth",
    "atracciones": "/api/atracciones",
    "visitantes": "/api/visitantes"
  }
}
```

## 🧪 Paso 3: Probar Cabeceras de Seguridad (Helmet)

### 3.1 Verificar Cabeceras HTTP
```bash
curl -I http://localhost:3000/
```

**Cabeceras esperadas**:
```http
HTTP/1.1 200 OK
X-DNS-Prefetch-Control: off
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: no-referrer
Content-Security-Policy: default-src 'self'
```

### 3.2 Verificar Helmet con DevTools
1. Abre tu navegador
2. Ve a `http://localhost:3000/`
3. Presiona F12 (DevTools)
4. Ve a la pestaña "Network"
5. Recarga la página
6. Haz clic en la request principal
7. Revisa las cabeceras de respuesta

## 🔐 Paso 4: Probar Autenticación y RBAC

### 4.1 Registrar Usuario Normal
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "nombre": "Juan Perez",
    "email": "juan@test.com",
    "password": "Pass123!"
  }'
```

**Respuesta esperada**:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "nombre": "Juan Perez",
    "email": "juan@test.com",
    "role": "user"
  }
}
```

### 4.2 Intentar Acceder a Ruta de Admin (Debe Fallar)
```bash
curl -X GET http://localhost:3000/auth/users \
  -b cookies.txt
```

**Respuesta esperada**:
```json
{
  "success": false,
  "error": {
    "message": "No tienes permisos para realizar esta accion",
    "code": "FORBIDDEN"
  }
}
```

### 4.3 Registrar Usuario Admin
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -c admin_cookies.txt \
  -d '{
    "nombre": "Admin User",
    "email": "admin@test.com",
    "password": "Admin123!"
  }'
```

### 4.4 Cambiar Rol a Admin (requiere otro admin o edición directa)
```bash
# Primero obtén el ID del usuario admin de la respuesta anterior
# Luego edita directamente en MongoDB o usa un script

# O usa el endpoint si ya tienes un admin:
curl -X PATCH http://localhost:3000/auth/users/<ID_USER>/role \
  -H "Content-Type: application/json" \
  -b admin_cookies.txt \
  -d '{"role": "admin"}'
```

### 4.5 Probar Acceso Admin con Token Admin
```bash
curl -X GET http://localhost:3000/auth/users \
  -b admin_cookies.txt
```

**Respuesta esperada**:
```json
{
  "success": true,
  "data": {
    "usuarios": [...],
    "total": 2,
    "pagina": 1,
    "limite": 10,
    "totalPaginas": 1
  }
}
```

## 🚦 Paso 5: Probar Rate Limiting

### 5.1 Probar Rate Limiting General
```bash
# Haz muchas requests rápidas
for i in {1..150}; do
  curl http://localhost:3000/
done
```

**Después de ~100 requests deberías ver**:
```json
{
  "success": false,
  "error": {
    "message": "Demasiadas solicitudes, intenta de nuevo mas tarde",
    "code": "TOO_MANY_REQUESTS"
  }
}
```

### 5.2 Probar Rate Limiting Estricto (Login)
```bash
# Haz 6 intentos de login en menos de 5 minutos
for i in {1..6}; do
  curl -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

**El 6to intento debería fallar con rate limit**:
```json
{
  "success": false,
  "error": {
    "message": "Limite de solicitudes excedido para esta accion, espera unos minutos",
    "code": "TOO_MANY_REQUESTS"
  }
}
```

### 5.3 Verificar Cabeceras de Rate Limiting
```bash
curl -I http://localhost:3000/
```

**Deberías ver**:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1634567890
```

## 🌐 Paso 6: Probar CORS

### 6.1 Probar con Origen Permitido
```bash
curl -X GET http://localhost:3000/ \
  -H "Origin: http://localhost:5173" \
  -I
```

**Deberías ver**:
```http
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
```

### 6.2 Probar con Origen No Permitido
```bash
curl -X GET http://localhost:3000/ \
  -H "Origin: http://malicious.com" \
  -I
```

**No deberías ver**:
```http
Access-Control-Allow-Origin: http://malicious.com
```

### 6.3 Probar Preflight Request
```bash
curl -X OPTIONS http://localhost:3000/api/atracciones \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -I
```

## 🧹 Paso 7: Probar Sanitización de Inputs

### 7.1 Probar Sanitización XSS
```bash
curl -X POST http://localhost:3000/api/atracciones \
  -H "Content-Type: application/json" \
  -b admin_cookies.txt \
  -d '{
    "nombre": "<script>alert(\"XSS\")</script>",
    "descripcion": "Descripcion normal",
    "categoria": "acceso",
    "capacidad": 100,
    "precio": 10
  }'
```

**Verificar que los caracteres `<script>` fueron eliminados**:
```json
{
  "success": true,
  "data": {
    "nombre": "alert(\"XSS\")",
    "descripcion": "Descripcion normal",
    ...
  }
}
```

### 7.2 Probar Sanitización NoSQL Injection
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "email": {"$ne": null},
    "password": {"$ne": null}
  }'
```

**Debería fallar con error de validación**:
```json
{
  "success": false,
  "error": {
    "message": "email: Expected string, received object",
    "code": "VALIDATION_ERROR"
  }
}
```

### 7.3 Prober Validación de Datos
```bash
# Email inválido
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","email":"invalido","password":"Pass123!"}'

# Password muy corta
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","email":"test@test.com","password":"short"}'

# Campos faltantes
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","email":"test@test.com"}'
```

## 📊 Paso 8: Probar Endpoints Completos

### 8.1 Flujo Completo de Atracciones

```bash
# 1. Crear atracción (solo admin)
curl -X POST http://localhost:3000/api/atracciones \
  -H "Content-Type: application/json" \
  -b admin_cookies.txt \
  -d '{
    "nombre": "Montaña Rusa",
    "descripcion": "La atracción más emocionante del parque",
    "categoria": "montana_rusa",
    "capacidad": 20,
    "altura_minima": 140,
    "precio": 25,
    "activa": true
  }'

# 2. Listar atracciones (cualquier usuario autenticado)
curl -X GET http://localhost:3000/api/atracciones \
  -b cookies.txt

# 3. Filtrar por categoría
curl -X GET "http://localhost:3000/api/atracciones?categoria=montana_rusa" \
  -b cookies.txt

# 4. Obtener una atracción específica
curl -X GET http://localhost:3000/api/atracciones/<ID> \
  -b cookies.txt

# 5. Actualizar atracción (solo admin)
curl -X PUT http://localhost:3000/api/atracciones/<ID> \
  -H "Content-Type: application/json" \
  -b admin_cookies.txt \
  -d '{"precio": 30}'

# 6. Eliminar atracción (solo admin)
curl -X DELETE http://localhost:3000/api/atracciones/<ID> \
  -b admin_cookies.txt
```

### 8.2 Flujo Completo de Visitantes

```bash
# 1. Crear visitante (cualquier usuario autenticado)
curl -X POST http://localhost:3000/api/visitantes \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "nombre": "Maria Garcia",
    "email": "maria@test.com",
    "telefono": "1234567890",
    "fecha_visita": "2024-09-23"
  }'

# 2. Listar visitantes
curl -X GET http://localhost:3000/api/visitantes \
  -b cookies.txt

# 3. Filtrar por fecha
curl -X GET http://localhost:3000/api/visitantes/fecha/2024-09-23 \
  -b cookies.txt

# 4. Actualizar visitante (solo admin)
curl -X PUT http://localhost:3000/api/visitantes/<ID> \
  -H "Content-Type: application/json" \
  -b admin_cookies.txt \
  -d '{"telefono": "9876543210"}'
```

## 🔍 Paso 9: Verificar Logs y Errores

### 9.1 Revisar Logs del Servidor
El servidor debería mostrar logs como:
```
GET / 200 5ms
POST /auth/register 201 15ms
GET /auth/users 403 2ms
POST /auth/login 429 1ms
```

### 9.2 Probar Manejo de Errores

```bash
# ID no existe
curl -X GET http://localhost:3000/api/atracciones/507f1f77bcf86cd799439011 \
  -b cookies.txt

# Método no permitido
curl -X POST http://localhost:3000/api/atracciones \
  -b cookies.txt

# Ruta no existe
curl -X GET http://localhost:3000/api/ruta-inexistente \
  -b cookies.txt
```

## ✅ Paso 10: Checklist de Verificación

### Seguridad
- [ ] Helmet está configurado y las cabeceras son correctas
- [ ] CORS permite solo orígenes de la whitelist
- [ ] Rate limiting funciona para endpoints generales
- [ ] Rate limiting estricto funciona para endpoints sensibles
- [ ] Los inputs son sanitizados correctamente
- [ ] NoSQL injection es prevenido
- [ ] XSS es prevenido

### Autenticación y Autorización
- [ ] Registro funciona correctamente
- [ ] Login funciona y retorna token
- [ ] Token se guarda en cookie HttpOnly
- [ ] Rutas protegidas requieren autenticación
- [ ] Rutas de admin requieren rol admin
- [ ] Usuarios normales no pueden acceder a rutas admin

### Funcionalidad
- [ ] CRUD de atracciones funciona
- [ ] CRUD de visitantes funciona
- [ ] Filtros y búsqueda funcionan
- [ ] Validación de datos funciona
- [ ] Manejo de errores funciona

### Compilación
- [ ] `npm run build` compila sin errores
- [ ] `npm run dev` inicia el servidor
- [ ] No hay errores en consola

## 🛠️ Troubleshooting

### MongoDB no conecta
```bash
# Verificar que MongoDB esté corriendo
mongosh

# Si no está corriendo, iniciar MongoDB
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Puerto ya en uso
```bash
# Cambiar el puerto en .env
PORT=3001

# O matar el proceso que usa el puerto 3000
# Windows: netstat -ano | findstr :3000
# Luego: taskkill /PID <PID> /F
```

### Errores de compilación
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# O limpiar la carpeta dist
rm -rf dist
npm run build
```

### CORS no funciona
```bash
# Verificar que el origen esté en la whitelist
# En .env: CORS_ORIGINS=http://localhost:5173

# Verificar que estés enviando el header Origin
curl -H "Origin: http://localhost:5173" http://localhost:3000/
```

## 🎯 Conclusión

Si todos los tests pasan, tu implementación de la semana 8 está completa y funcionando correctamente. Has implementado:

1. ✅ **RBAC** con middlewares `requireAuth()` y `requireRole()`
2. ✅ **Helmet** con cabeceras de seguridad
3. ✅ **CORS** configurado con whitelist
4. ✅ **Rate Limiting** general y estricto
5. ✅ **Sanitización** de inputs para prevenir inyecciones
6. ✅ **Validación** con Zod
7. ✅ **OWASP Top 10** mitigaciones

¡Felicidades por completar la semana 8! 🎉
