import { Usuario } from '../src/models/Usuario';

describe("Usuario Model - Integration Tests", () => {
  it("debe crear usuario correctamente", async () => {
    const usuarioData = {
      nombre: 'Juan Perez',
      email: 'juan@test.com',
      password: 'Password123!',
      role: 'user' as const
    };

    const usuario = new Usuario(usuarioData);
    const guardado = await usuario.save();

    expect(guardado).toBeDefined();
    expect(guardado._id).toBeDefined();
    expect(guardado.nombre).toBe(usuarioData.nombre);
    expect(guardado.email).toBe(usuarioData.email);
    expect(guardado.role).toBe(usuarioData.role);
  });

  it("debe rechazar usuario con email duplicado", async () => {
    const usuarioData = {
      nombre: 'Juan Perez',
      email: 'juan@test.com',
      password: 'Password123!',
      role: 'user' as const
    };

    await new Usuario(usuarioData).save();

    const usuarioDuplicado = new Usuario(usuarioData);
    
    await expect(usuarioDuplicado.save()).rejects.toThrow();
  });

  it("debe rechazar usuario sin nombre", async () => {
    const usuarioData = {
      nombre: '',
      email: 'juan@test.com',
      password: 'Password123!',
      role: 'user' as const
    };

    const usuario = new Usuario(usuarioData);
    
    await expect(usuario.save()).rejects.toThrow();
  });

  it("debe rechazar usuario con email inválido", async () => {
    const usuarioData = {
      nombre: 'Juan Perez',
      email: 'invalido',
      password: 'Password123!',
      role: 'user' as const
    };

    const usuario = new Usuario(usuarioData);
    
    await expect(usuario.save()).rejects.toThrow();
  });

  it("debe rechazar usuario con contraseña muy corta", async () => {
    const usuarioData = {
      nombre: 'Juan Perez',
      email: 'juan@test.com',
      password: 'short',
      role: 'user' as const
    };

    const usuario = new Usuario(usuarioData);
    
    await expect(usuario.save()).rejects.toThrow();
  });

  it("debe buscar usuario por email", async () => {
    const usuarioData = {
      nombre: 'Juan Perez',
      email: 'juan@test.com',
      password: 'Password123!',
      role: 'user' as const
    };

    await new Usuario(usuarioData).save();

    const encontrado = await Usuario.findOne({ email: 'juan@test.com' });
    
    expect(encontrado).toBeDefined();
    expect(encontrado.nombre).toBe(usuarioData.nombre);
  });

  it("debe actualizar usuario correctamente", async () => {
    const usuario = new Usuario({
      nombre: 'Juan Perez',
      email: 'juan@test.com',
      password: 'Password123!',
      role: 'user' as const
    });
    
    await usuario.save();
    
    usuario.nombre = 'Juan Actualizado';
    const actualizado = await usuario.save();
    
    expect(actualizado.nombre).toBe('Juan Actualizado');
  });

  it("debe eliminar usuario correctamente", async () => {
    const usuario = new Usuario({
      nombre: 'Juan Perez',
      email: 'juan@test.com',
      password: 'Password123!',
      role: 'user' as const
    });
    
    await usuario.save();
    
    const eliminado = await Usuario.findByIdAndDelete(usuario._id);
    
    expect(eliminado).toBeDefined();
    expect(eliminado._id).toEqual(usuario._id);
  });
});
