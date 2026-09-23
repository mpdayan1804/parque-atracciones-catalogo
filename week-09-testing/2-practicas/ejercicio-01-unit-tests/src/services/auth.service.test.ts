import { AuthService } from './auth.service';

describe("AuthService - Unit Tests con Mocks", () => {
  let authService: AuthService;
  let mockUsuarioRepository: any;
  let mockJwtUtils: any;

  beforeEach(() => {
    // Mock del usuario repository
    mockUsuarioRepository = {
      buscarPorEmail: jest.fn(),
      crear: jest.fn(),
      buscarPorId: jest.fn(),
      compararPassword: jest.fn()
    };

    // Mock del jwt utils
    mockJwtUtils = {
      generateToken: jest.fn()
    };

    authService = new AuthService(mockUsuarioRepository, mockJwtUtils);
  });

  describe("registrar", () => {
    it("debe registrar usuario nuevo correctamente", async () => {
      const datos = {
        nombre: 'Juan Perez',
        email: 'juan@test.com',
        password: 'Password123!',
        role: 'user'
      };

      mockUsuarioRepository.buscarPorEmail.mockResolvedValue(null);
      mockUsuarioRepository.crear.mockResolvedValue({
        id: '123',
        nombre: datos.nombre,
        email: datos.email,
        role: datos.role
      });
      mockJwtUtils.generateToken.mockReturnValue('mock-token');

      const resultado = await authService.registrar(datos);

      expect(mockUsuarioRepository.buscarPorEmail).toHaveBeenCalledWith(datos.email);
      expect(mockUsuarioRepository.crear).toHaveBeenCalledWith(datos);
      expect(mockJwtUtils.generateToken).toHaveBeenCalledWith({
        id: '123',
        email: datos.email,
        role: datos.role
      });
      expect(resultado).toEqual({
        usuario: {
          id: '123',
          nombre: datos.nombre,
          email: datos.email,
          role: datos.role
        },
        token: 'mock-token'
      });
    });

    it("debe lanzar error si email ya existe", async () => {
      const datos = {
        nombre: 'Juan Perez',
        email: 'juan@test.com',
        password: 'Password123!'
      };

      mockUsuarioRepository.buscarPorEmail.mockResolvedValue({
        id: '123',
        email: datos.email
      });

      await expect(authService.registrar(datos)).rejects.toThrow('El email ya está registrado');
      expect(mockUsuarioRepository.crear).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("debe hacer login con credenciales válidas", async () => {
      const credenciales = {
        email: 'juan@test.com',
        password: 'Password123!'
      };

      const usuarioMock = {
        id: '123',
        nombre: 'Juan Perez',
        email: credenciales.email,
        role: 'user',
        password: 'hashedPassword'
      };

      mockUsuarioRepository.buscarPorEmail.mockResolvedValue(usuarioMock);
      mockUsuarioRepository.compararPassword.mockResolvedValue(true);
      mockJwtUtils.generateToken.mockReturnValue('mock-token');

      const resultado = await authService.login(credenciales);

      expect(mockUsuarioRepository.buscarPorEmail).toHaveBeenCalledWith(credenciales.email);
      expect(mockUsuarioRepository.compararPassword).toHaveBeenCalledWith(
        credenciales.password,
        usuarioMock.password
      );
      expect(mockJwtUtils.generateToken).toHaveBeenCalledWith({
        id: usuarioMock.id,
        email: usuarioMock.email,
        role: usuarioMock.role
      });
      expect(resultado.token).toBe('mock-token');
    });

    it("debe lanzar error si usuario no existe", async () => {
      const credenciales = {
        email: 'noexiste@test.com',
        password: 'Password123!'
      };

      mockUsuarioRepository.buscarPorEmail.mockResolvedValue(null);

      await expect(authService.login(credenciales)).rejects.toThrow('Credenciales inválidas');
      expect(mockUsuarioRepository.compararPassword).not.toHaveBeenCalled();
    });

    it("debe lanzar error si password es incorrecta", async () => {
      const credenciales = {
        email: 'juan@test.com',
        password: 'PasswordIncorrecta!'
      };

      const usuarioMock = {
        id: '123',
        email: credenciales.email,
        password: 'hashedPassword'
      };

      mockUsuarioRepository.buscarPorEmail.mockResolvedValue(usuarioMock);
      mockUsuarioRepository.compararPassword.mockResolvedValue(false);

      await expect(authService.login(credenciales)).rejects.toThrow('Credenciales inválidas');
      expect(mockJwtUtils.generateToken).not.toHaveBeenCalled();
    });
  });

  describe("obtenerUsuario", () => {
    it("debe obtener usuario por ID", async () => {
      const usuarioMock = {
        id: '123',
        nombre: 'Juan Perez',
        email: 'juan@test.com',
        role: 'user'
      };

      mockUsuarioRepository.buscarPorId.mockResolvedValue(usuarioMock);

      const resultado = await authService.obtenerUsuario('123');

      expect(mockUsuarioRepository.buscarPorId).toHaveBeenCalledWith('123');
      expect(resultado).toEqual({
        id: usuarioMock.id,
        nombre: usuarioMock.nombre,
        email: usuarioMock.email,
        role: usuarioMock.role
      });
    });

    it("debe lanzar error si usuario no existe", async () => {
      mockUsuarioRepository.buscarPorId.mockResolvedValue(null);

      await expect(authService.obtenerUsuario('999')).rejects.toThrow('Usuario no encontrado');
    });
  });
});
