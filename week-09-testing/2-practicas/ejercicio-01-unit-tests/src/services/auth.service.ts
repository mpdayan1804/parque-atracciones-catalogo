// Servicio de autenticación para practicar unit tests con mocks

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Credenciales {
  email: string;
  password: string;
}

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export class AuthService {
  constructor(
    private usuarioRepository: any,
    private jwtUtils: any
  ) {}

  async registrar(datos: { nombre: string; email: string; password: string; role?: string }) {
    const existeUsuario = await this.usuarioRepository.buscarPorEmail(datos.email);
    if (existeUsuario) {
      throw new Error('El email ya está registrado');
    }

    const usuario = await this.usuarioRepository.crear(datos);
    const token = this.jwtUtils.generateToken({
      id: usuario.id,
      email: usuario.email,
      role: usuario.role
    });

    return {
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role
      },
      token
    };
  }

  async login(credenciales: Credenciales) {
    const usuario = await this.usuarioRepository.buscarPorEmail(credenciales.email);
    
    if (!usuario) {
      throw new Error('Credenciales inválidas');
    }

    const passwordValida = await this.usuarioRepository.compararPassword(
      credenciales.password, 
      usuario.password
    );
    
    if (!passwordValida) {
      throw new Error('Credenciales inválidas');
    }

    const token = this.jwtUtils.generateToken({
      id: usuario.id,
      email: usuario.email,
      role: usuario.role
    });

    return {
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role
      },
      token
    };
  }

  async obtenerUsuario(id: string) {
    const usuario = await this.usuarioRepository.buscarPorId(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      role: usuario.role
    };
  }
}
