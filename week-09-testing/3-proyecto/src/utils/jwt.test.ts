import { generateToken, verifyToken } from './jwt';

describe("JWT Utils", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-key';
  });

  describe("generateToken", () => {
    it("debe generar un token válido", () => {
      const payload = {
        id: '123',
        email: 'test@test.com',
        role: 'user'
      };

      const token = generateToken(payload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it("debe generar token con payload correcto", () => {
      const payload = {
        id: '123',
        email: 'test@test.com',
        role: 'admin'
      };

      const token = generateToken(payload);
      const decoded = verifyToken(token);
      
      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });
  });

  describe("verifyToken", () => {
    it("debe verificar token válido", () => {
      const payload = {
        id: '123',
        email: 'test@test.com',
        role: 'user'
      };

      const token = generateToken(payload);
      const decoded = verifyToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(payload.id);
    });

    it("debe lanzar error con token inválido", () => {
      expect(() => {
        verifyToken('invalid-token');
      }).toThrow('Token invalido o expirado');
    });

    it("debe lanzar error con token vacío", () => {
      expect(() => {
        verifyToken('');
      }).toThrow('Token invalido o expirado');
    });
  });
});
