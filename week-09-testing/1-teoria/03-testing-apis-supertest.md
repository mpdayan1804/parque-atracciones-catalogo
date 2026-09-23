# 03 - Testing APIs con Supertest

## 🎯 Objetivos
- Configurar Supertest para testing de APIs
- Escribir tests de integración para endpoints HTTP
- Probar rutas, middlewares y controllers
- Manejar autenticación en tests
- Testing de bases de datos en memoria

## 📚 ¿Qué es Supertest?

**Supertest** es una biblioteca de testing para HTTP assertions, diseñada específicamente para testing de APIs Node.js/Express.

**Características**:
- Hace requests HTTP reales
- Facilita testing de endpoints
- Integración perfecta con Jest
- Soporta chaining de assertions
- Maneja cookies y sesiones

## 🚀 Instalación y Configuración

### Instalación

```bash
npm install --save-dev supertest @types/supertest
```

### Configuración Básica

```typescript
// tests/setup.ts
import request from 'supertest';
import app from '../src/app';

export const testRequest = request(app);
```

## 🧪 Testing de Endpoints

### Test Básico de Endpoint

```typescript
import request from 'supertest';
import app from '../src/app';

describe("GET /", () => {
  it("debe retornar 200 y mensaje de bienvenida", async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body).toHaveProperty('mensaje');
    expect(response.body.mensaje).toContain('API');
  });
});
```

### Test de Endpoint con Query Params

```typescript
describe("GET /api/atracciones", () => {
  it("debe filtrar atracciones por categoría", async () => {
    const response = await request(app)
      .get('/api/atracciones')
      .query({ categoria: 'montana_rusa' })
      .expect(200);
    
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.every(attr => 
      attr.categoria === 'montana_rusa'
    )).toBe(true);
  });
});
```

### Test de Endpoint POST

```typescript
describe("POST /api/usuarios", () => {
  it("debe crear un nuevo usuario", async () => {
    const nuevoUsuario = {
      nombre: 'Juan Perez',
      email: 'juan@test.com',
      password: 'Pass123!'
    };

    const response = await request(app)
      .post('/api/usuarios')
      .send(nuevoUsuario)
      .expect('Content-Type', /json/)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.email).toBe(nuevoUsuario.email);
  });

  it("debe rechazar usuario con email inválido", async () => {
    const usuarioInvalido = {
      nombre: 'Juan',
      email: 'invalido',
      password: 'Pass123!'
    };

    const response = await request(app)
      .post('/api/usuarios')
      .send(usuarioInvalido)
      .expect(400);
    
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
```

### Test de Endpoint PUT/PATCH

```typescript
describe("PUT /api/usuarios/:id", () => {
  it("debe actualizar un usuario existente", async () => {
    const usuarioId = '507f1f77bcf86cd799439011';
    const datosActualizacion = {
      nombre: 'Juan Actualizado'
    };

    const response = await request(app)
      .put(`/api/usuarios/${usuarioId}`)
      .send(datosActualizacion)
      .expect(200);
    
    expect(response.body.data.nombre).toBe(datosActualizacion.nombre);
  });

  it("debe retornar 404 para usuario inexistente", async () => {
    const response = await request(app)
      .put('/api/usuarios/507f1f77bcf86cd799439999')
      .send({ nombre: 'Test' })
      .expect(404);
    
    expect(response.body.error.code).toBe('NOT_FOUND');
  });
});
```

### Test de Endpoint DELETE

```typescript
describe("DELETE /api/usuarios/:id", () => {
  it("debe eliminar un usuario existente", async () => {
    const usuarioId = '507f1f77bcf86cd799439011';

    const response = await request(app)
      .delete(`/api/usuarios/${usuarioId}`)
      .expect(200);
    
    expect(response.body.data.mensaje).toContain('eliminado');
  });
});
```

## 🔐 Testing con Autenticación

### Testing con JWT en Headers

```typescript
import jwt from 'jsonwebtoken';

describe("GET /api/usuarios", () => {
  let authToken: string;

  beforeEach(() => {
    // Generar token de prueba
    authToken = jwt.sign(
      { id: 'test-id', email: 'test@test.com', role: 'admin' },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  it("debe permitir acceso con token válido", async () => {
    const response = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
    
    expect(response.body.data).toBeInstanceOf(Array);
  });

  it("debe rechazar acceso sin token", async () => {
    const response = await request(app)
      .get('/api/usuarios')
      .expect(401);
    
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it("debe rechazar acceso con token inválido", async () => {
    const response = await request(app)
      .get('/api/usuarios')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
    
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });
});
```

### Testing con Cookies

```typescript
describe("GET /auth/me", () => {
  it("debe retornar usuario con cookie válida", async () => {
    // Primero hacer login para obtener cookie
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'Pass123!' });
    
    const cookie = loginResponse.headers['set-cookie'];

    // Usar la cookie en siguiente request
    const response = await request(app)
      .get('/auth/me')
      .set('Cookie', cookie)
      .expect(200);
    
    expect(response.body.data.email).toBe('test@test.com');
  });
});
```

## 🗄️ Testing con Base de Datos

### Usando MongoDB Memory Server

```bash
npm install --save-dev mongodb-memory-server
```

```typescript
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe("Database Tests", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // Limpiar colecciones después de cada test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  it("debe crear usuario en base de datos", async () => {
    const Usuario = mongoose.model('Usuario');
    const usuario = new Usuario({
      nombre: 'Juan',
      email: 'juan@test.com',
      password: 'hashedPassword'
    });
    
    await usuario.save();
    
    const encontrado = await Usuario.findOne({ email: 'juan@test.com' });
    expect(encontrado).toBeDefined();
    expect(encontrado.nombre).toBe('Juan');
  });
});
```

### Testing de Repositories

```typescript
import { UsuarioRepository } from '../src/repositories/usuario.repository';
import { Usuario } from '../src/models/Usuario';

describe("UsuarioRepository", () => {
  let repository: UsuarioRepository;

  beforeEach(() => {
    repository = new UsuarioRepository();
  });

  it("debe crear usuario correctamente", async () => {
    const datos = {
      nombre: 'Juan',
      email: 'juan@test.com',
      password: 'hashedPassword'
    };

    const usuario = await repository.crear(datos);
    
    expect(usuario).toHaveProperty('_id');
    expect(usuario.email).toBe(datos.email);
  });

  it("debe buscar usuario por email", async () => {
    const usuario = await repository.buscarPorEmail('juan@test.com');
    
    expect(usuario).toBeDefined();
    expect(usuario.email).toBe('juan@test.com');
  });
});
```

## 🎭 Mocking de Dependencias

### Mocking de Services

```typescript
import { AuthController } from '../src/controllers/auth.controller';
import { AuthService } from '../src/services/auth.service';

describe("AuthController", () => {
  let controller: AuthController;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    mockAuthService = {
      registrar: jest.fn(),
      login: jest.fn(),
      obtenerUsuario: jest.fn()
    } as any;

    controller = new AuthController(mockAuthService);
  });

  it("debe registrar usuario correctamente", async () => {
    const mockReq = {
      body: {
        nombre: 'Juan',
        email: 'juan@test.com',
        password: 'Pass123!'
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const mockNext = jest.fn();

    mockAuthService.registrar.mockResolvedValue({
      usuario: { id: '1', nombre: 'Juan', email: 'juan@test.com' },
      token: 'mock-token'
    });

    await controller.registrar(mockReq as any, mockRes as any, mockNext);

    expect(mockAuthService.registrar).toHaveBeenCalledWith(mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalled();
  });
});
```

### Mocking de Database

```typescript
import { Usuario } from '../src/models/Usuario';

describe("Usuario Model con Mock", () => {
  it("debe llamar método save", async () => {
    const saveMock = jest.fn().mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      nombre: 'Juan',
      email: 'juan@test.com'
    });

    Usuario.prototype.save = saveMock;

    const usuario = new Usuario({
      nombre: 'Juan',
      email: 'juan@test.com',
      password: 'hashedPassword'
    });

    await usuario.save();

    expect(saveMock).toHaveBeenCalled();
  });
});
```

## 🧪 Testing de Middlewares

### Testing de Middleware de Autenticación

```typescript
import { requireAuth } from '../src/middlewares/requireAuth';
import { Request, Response, NextFunction } from 'express';

describe("requireAuth middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      cookies: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it("debe llamar next con token válido", () => {
    mockReq.cookies = { token: 'valid-token' };
    
    requireAuth(mockReq as Request, mockRes as Response, mockNext);
    
    expect(mockNext).toHaveBeenCalled();
  });

  it("debe retornar 401 sin token", () => {
    requireAuth(mockReq as Request, mockRes as Response, mockNext);
    
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
```

### Testing de Middleware de Validación

```typescript
import { validate } from '../src/middlewares/validate';
import { z } from 'zod';

describe("validate middleware", () => {
  const schema = z.object({
    nombre: z.string().min(3),
    email: z.string().email()
  });

  it("debe pasar validación con datos correctos", () => {
    const mockReq = {
      body: { nombre: 'Juan', email: 'juan@test.com' }
    };
    const mockRes = {};
    const mockNext = jest.fn();

    validate(schema)(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("debe rechazar datos inválidos", () => {
    const mockReq = {
      body: { nombre: 'Ju', email: 'invalido' }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const mockNext = jest.fn();

    validate(schema)(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
```

## 🧪 Testing de RBAC

### Testing de Roles

```typescript
describe("RBAC Testing", () => {
  let authToken: string;

  beforeEach(() => {
    authToken = jwt.sign(
      { id: 'test-id', email: 'test@test.com', role: 'user' },
      process.env.JWT_SECRET || 'test-secret'
    );
  });

  it("debe permitir acceso a ruta de user", async () => {
    const response = await request(app)
      .get('/api/atracciones')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  it("debe denegar acceso a ruta de admin", async () => {
    const response = await request(app)
      .get('/auth/users')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(403);
    
    expect(response.body.error.code).toBe('FORBIDDEN');
  });

  it("debe permitir acceso a admin con rol correcto", async () => {
    const adminToken = jwt.sign(
      { id: 'admin-id', email: 'admin@test.com', role: 'admin' },
      process.env.JWT_SECRET || 'test-secret'
    );

    const response = await request(app)
      .get('/auth/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
});
```

## 🧪 Testing de Rate Limiting

```typescript
describe("Rate Limiting", () => {
  it("debe permitir requests dentro del límite", async () => {
    const responses = await Promise.all([
      request(app).get('/'),
      request(app).get('/'),
      request(app).get('/')
    ]);

    responses.forEach(response => {
      expect(response.status).not.toBe(429);
    });
  });

  it("debe bloquear requests excesivos", async () => {
    // Hacer muchas requests rápidamente
    const requests = Array(150).fill(null).map(() => 
      request(app).get('/')
    );

    const responses = await Promise.all(requests);
    const rateLimited = responses.filter(r => r.status === 429);

    expect(rateLimited.length).toBeGreaterThan(0);
  });
});
```

## 🎯 Buenas Prácticas

### 1. Tests Independientes

```typescript
// ❌ MAL: Tests que dependen del estado de la BD
describe("Usuarios", () => {
  it("debe crear usuario", async () => {
    await Usuario.create({ nombre: 'Juan' });
  });

  it("debe listar usuarios", async () => {
    const usuarios = await Usuario.find();
    expect(usuarios.length).toBeGreaterThan(0); // Depende del test anterior
  });
});

// ✅ BIEN: Tests independientes con cleanup
describe("Usuarios", () => {
  afterEach(async () => {
    await Usuario.deleteMany({});
  });

  it("debe crear usuario", async () => {
    const usuario = await Usuario.create({ nombre: 'Juan' });
    expect(usuario).toBeDefined();
  });

  it("debe listar usuarios", async () => {
    await Usuario.create({ nombre: 'Juan' });
    const usuarios = await Usuario.find();
    expect(usuarios.length).toBe(1);
  });
});
```

### 2. Tests Descriptivos

```typescript
// ❌ MAL
it("debe funcionar", async () => {
  const response = await request(app).get('/api/usuarios');
  expect(response.status).toBe(200);
});

// ✅ BIEN
it("debe retornar 200 y lista de usuarios", async () => {
  const response = await request(app).get('/api/usuarios');
  expect(response.status).toBe(200);
  expect(response.body.data).toBeInstanceOf(Array);
});
```

### 3. Mocking Apropiado

```typescript
// ❌ MAL: Mock excesivo
jest.mock('../src/services/auth.service', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    registrar: jest.fn().mockResolvedValue({ usuario: {}, token: '' }),
    login: jest.fn().mockResolvedValue({ usuario: {}, token: '' }),
    // ... todos los métodos
  }))
}));

// ✅ BIEN: Mock solo lo necesario
jest.mock('../src/services/auth.service', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    registrar: jest.fn().mockResolvedValue({ usuario: {}, token: '' })
  }))
}));
```

## 🎯 Resumen

- **Supertest**: Biblioteca para testing de APIs HTTP
- **Testing de endpoints**: GET, POST, PUT, DELETE con assertions
- **Autenticación**: Testing con JWT headers y cookies
- **Base de datos**: MongoDB Memory Server para tests aislados
- **Mocking**: Services, database, middlewares
- **RBAC**: Testing de roles y permisos
- **Rate limiting**: Testing de límites de requests

## 📖 Recursos Adicionales

- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
- [Express Testing Guide](https://expressjs.com/en/guide/testing.html)
