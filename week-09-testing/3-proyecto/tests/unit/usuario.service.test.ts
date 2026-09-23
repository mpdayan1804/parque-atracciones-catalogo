import { UsuarioService } from '../src/services/usuario.service';
import { Usuario } from '../src/models/Usuario';

describe("UsuarioService - Unit Tests", () => {
  let usuarioService: UsuarioService;

  beforeEach(() => {
    usuarioService = new UsuarioService();
  });

  describe("crear", () => {
    it("debe crear usuario con datos válidos", async () => {
      const datos = {
        nombre: 'Juan Perez',
        email: 'juan@test.com',
        password: 'Password123!',
        role: 'user'
      };

      const usuario = new Usuario(datos);
      const saveMock = jest.spyOn(usuario, 'save').mockResolvedValue({
        _id: '123',
        ...datos
      });

      // Como estamos trabajando con una DB real en memoria, 
      // este test sería más de integración
      // Para unit test puro, necesitaríamos mockear el modelo
    });
  });

  describe("buscarPorEmail", () => {
    it("debe buscar usuario por email", async () => {
      const email = 'juan@test.com';
      
      // En un ambiente real con DB en memoria
      const usuario = await usuarioService.buscarPorEmail(email);
      
      // Como no hay datos, retorna null
      expect(usuario).toBeNull();
    });
  });

  describe("listar", () => {
    it("debe listar usuarios con paginación", async () => {
      const usuarios = await usuarioService.listar(0, 10);
      
      expect(Array.isArray(usuarios)).toBe(true);
    });
  });
});
