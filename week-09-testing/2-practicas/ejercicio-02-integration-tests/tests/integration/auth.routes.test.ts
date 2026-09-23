import request from 'supertest';
import { app, connectDB } from '../src/app.js';
import { Usuario } from '../src/models/Usuario.js';

describe("POST /auth/register - Integration Tests", () => {
  beforeAll(async () => {
    const mongoServerUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
    await connectDB(mongoServerUri);
  });

  it("debe registrar usuario nuevo con datos válidos", async () => {
    const nuevoUsuario = {
      nombre: 'Juan Perez',
      email: 'juan@test.com',
      password: 'Password123!',
      role: 'user'
    };

    const response = await request(app)
      .post('/auth/register')
      .send(nuevoUsuario)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.email).toBe(nuevoUsuario.email);
    expect(response.body.data.nombre).toBe(nuevoUsuario.nombre);
  });

  it("debe rechazar registro con email duplicado", async () => {
    const usuarioData = {
      nombre: 'Juan Perez',
      email: 'juan@test.com',
      password: 'Password123!',
      role: 'user'
    };

    // Crear usuario primero
    await new Usuario(usuarioData).save();

    const response = await request(app)
      .post('/auth/register')
      .send(usuarioData)
      .expect(409);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('CONFLICT');
    expect(response.body.error.message).toContain('email');
  });

  it("debe rechazar registro sin nombre", async () => {
    const usuarioInvalido = {
      nombre: '',
      email: 'juan@test.com',
      password: 'Password123!'
    };

    const response = await request(app)
      .post('/auth/register')
      .send(usuarioInvalido)
      .expect(500);

    expect(response.body.success).toBe(false);
  });

  it("debe rechazar registro con email inválido", async () => {
    const usuarioInvalido = {
      nombre: 'Juan Perez',
      email: 'invalido',
      password: 'Password123!'
    };

    const response = await request(app)
      .post('/auth/register')
      .send(usuarioInvalido)
      .expect(500);

    expect(response.body.success).toBe(false);
  });
});

describe("POST /auth/login - Integration Tests", () => {
  let usuarioId: string;

  beforeEach(async () => {
    const usuario = new Usuario({
      nombre: 'Juan Perez',
      email: 'juan@test.com',
      password: 'Password123!',
      role: 'user'
    });
    const guardado = await usuario.save();
    usuarioId = guardado._id.toString();
  });

  it("debe hacer login con credenciales válidas", async () => {
    const credenciales = {
      email: 'juan@test.com',
      password: 'Password123!'
    };

    const response = await request(app)
      .post('/auth/login')
      .send(credenciales)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe(credenciales.email);
  });

  it("debe rechazar login con email inexistente", async () => {
    const credenciales = {
      email: 'noexiste@test.com',
      password: 'Password123!'
    };

    const response = await request(app)
      .post('/auth/login')
      .send(credenciales)
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it("debe rechazar login con password incorrecta", async () => {
    const credenciales = {
      email: 'juan@test.com',
      password: 'PasswordIncorrecta!'
    };

    const response = await request(app)
      .post('/auth/login')
      .send(credenciales)
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });
});

describe("GET /auth/me - Integration Tests", () => {
  let usuarioId: string;

  beforeEach(async () => {
    const usuario = new Usuario({
      nombre: 'Juan Perez',
      email: 'juan@test.com',
      password: 'Password123!',
      role: 'user'
    });
    const guardado = await usuario.save();
    usuarioId = guardado._id.toString();
  });

  it("debe retornar usuario con ID válido", async () => {
    const response = await request(app)
      .get('/auth/me')
      .set('user-id', usuarioId)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(usuarioId);
    expect(response.body.data.email).toBe('juan@test.com');
  });

  it("debe retornar 404 con ID inexistente", async () => {
    const response = await request(app)
      .get('/auth/me')
      .set('user-id', '507f1f77bcf86cd799439999')
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });

  it("debe retornar 404 sin ID", async () => {
    const response = await request(app)
      .get('/auth/me')
      .expect(404);

    expect(response.body.success).toBe(false);
  });
});
