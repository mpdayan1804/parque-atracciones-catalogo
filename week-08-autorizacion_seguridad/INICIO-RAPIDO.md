# 🚀 Guía de Inicio Rápido - Semana 8

## ✅ Estado Actual: COMPLETADO

### 📚 Contenido Completado:
- ✅ **Teoría**: 4 archivos completos (RBAC, Helmet, Rate Limiting/CORS, Sanitización/OWASP)
- ✅ **Prácticas**: 2 ejercicios funcionando (RBAC, Helmet+CORS+Rate Limit)
- ✅ **Proyecto**: API completa del Parque de Atracciones con todas las capas de seguridad
- ✅ **Recursos**: Ebooks gratuitos, webgrafía, videografía
- ✅ **Glosario**: 100+ términos de seguridad definidos
- ✅ **Documentación**: README, TESTING.md, guías completas

---

## 🎯 PASOS PARA PROBAR QUE TODO FUNCIONE

### Paso 1: Configurar Variables de Entorno

```bash
cd "parque-atracciones-catalogo-clon/week-08-autorizacion_seguridad/3-proyecto"

# Copiar el archivo de ejemplo
cp .env.example .env
```

**Edita `.env` con este contenido**:
```env
MONGODB_URI=mongodb://localhost:27017/parque_atracciones_seguridad
PORT=3000
NODE_ENV=development
JWT_SECRET=super_secret_key_development_please_change_in_production_32_chars
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Paso 2: Instalar Dependencias

```bash
cd "parque-atracciones-catalogo-clon/week-08-autorizacion_seguridad/3-proyecto"
npm install
```

### Paso 3: Verificar MongoDB

**Asegúrate de que MongoDB esté corriendo**:

```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# O verifica si ya está corriendo
mongosh
```

### Paso 4: Compilar el Proyecto

```bash
cd "parque-atracciones-catalogo-clon/week-08-autorizacion_seguridad/3-proyecto"
npm run build
```

**Debería ver**: Sin errores, compilación exitosa.

### Paso 5: Iniciar el Servidor

```bash
npm run dev
```

**Deberías ver**:
```
Conectado a MongoDB
Servidor corriendo en puerto 3000
```

### Paso 6: Probar Básico

En otra terminal:

```bash
curl http://localhost:3000/
```

**Deberías ver**:
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

---

## 🧪 PRUEBAS RÁPIDAS DE SEGURIDAD

### 1. Probar Cabeceras de Seguridad (Helmet)

```bash
curl -I http://localhost:3000/
```

**Deberías ver cabeceras como**:
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

### 2. Probar Registro de Usuario

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

**Deberías ver**:
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

### 3. Probar Acceso Denegado (Usuario normal a ruta admin)

```bash
curl -X GET http://localhost:3000/auth/users \
  -b cookies.txt
```

**Deberías ver error 403**:
```json
{
  "success": false,
  "error": {
    "message": "No tienes permisos para realizar esta accion",
    "code": "FORBIDDEN"
  }
}
```

### 4. Probar Sanitización (XSS)

```bash
# Primero crea un usuario admin (necesitas editar directamente en MongoDB o usar otro método)
# Luego prueba crear una atracción con script malicioso

curl -X POST http://localhost:3000/api/atracciones \
  -H "Content-Type: application/json" \
  -b admin_cookies.txt \
  -d '{
    "nombre": "<script>alert(\"XSS\")</script>",
    "descripcion": "Test",
    "categoria": "acceso",
    "capacidad": 100,
    "precio": 10
  }'
```

**Deberías ver que `<script>` fue eliminado del nombre**.

---

## 📋 CHECKLIST FINAL

### Compilación y Ejecución
- [ ] `npm install` ejecutado sin errores
- [ ] `npm run build` compila sin errores
- [ ] `npm run dev` inicia el servidor
- [ ] MongoDB conectado correctamente

### Funcionalidad Básica
- [ ] Endpoint raíz responde correctamente
- [ ] Registro de usuario funciona
- [ ] Login de usuario funciona
- [ ] Token se guarda en cookie

### Seguridad
- [ ] Cabeceras de Helmet presentes
- [ ] CORS configurado correctamente
- [ ] Rate limiting funciona
- [ ] RBAC funciona (user no puede acceder a rutas admin)
- [ ] Sanitización de inputs funciona

### Estructura
- [ ] Todos los archivos teóricos creados
- [ ] Ejercicios prácticos funcionando
- [ ] Proyecto semanal completo
- [ ] Documentación completa

---

## 🛠️ SOLUCIÓN DE PROBLEMAS COMUNES

### MongoDB no conecta
```bash
# Verificar que MongoDB esté corriendo
mongosh

# Si no está corriendo, iniciarlo
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
```

### Puerto 3000 en uso
```bash
# Cambiar puerto en .env
PORT=3001

# O matar el proceso
# Windows: netstat -ano | findstr :3000
# Luego: taskkill /PID <PID> /F
```

### Errores de compilación
```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### CORS no funciona
```bash
# Verificar que el origen esté en .env
CORS_ORIGINS=http://localhost:5173

# Verificar que envíes el header Origin
curl -H "Origin: http://localhost:5173" http://localhost:3000/
```

---

## 📚 DOCUMENTACIÓN DISPONIBLE

1. **README.md de la semana**: Guía general de la semana 8
2. **README.md del proyecto**: Documentación técnica del proyecto
3. **TESTING.md**: Guía completa de testing paso a paso
4. **Teoría**: 4 archivos con conceptos detallados
5. **Glosario**: 100+ términos de seguridad
6. **Recursos**: Ebooks, webgrafía, videografía

---

## 🎯 PRÓXIMOS PASOS

1. **Lee la teoría**: Comienza con `1-teoria/01-rbac-autorizacion.md`
2. **Revisa los ejercicios**: Mira cómo funcionan `2-practicas/`
3. **Estudia el proyecto**: Analiza `3-proyecto/src/` para ver la implementación
4. **Haz el testing completo**: Sigue `3-proyecto/TESTING.md`
5. **Prueba tú mismo**: Intenta crear nuevas rutas con RBAC

---

## 🎉 ¡FELICIDADES!

Has completado la semana 8 de autorización y seguridad. Has aprendido:

- ✅ **RBAC**: Control de acceso basado en roles
- ✅ **Helmet**: Cabeceras de seguridad HTTP
- ✅ **CORS**: Control de requests cross-origin
- ✅ **Rate Limiting**: Protección contra abusos
- ✅ **Sanitización**: Prevención de inyecciones
- ✅ **OWASP Top 10**: Principales vulnerabilidades web

**¿Listo para la semana 9 (Testing)?** 🚀
