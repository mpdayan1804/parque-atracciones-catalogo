# 02 - Jest Framework

## 🎯 Objetivos
- Configurar Jest en un proyecto TypeScript
- Escribir tests con Jest
- Usar assertions y matchers
- Implementar mocks y spies
- Entender snapshot testing

## 📚 ¿Qué es Jest?

**Jest** es un framework de testing de JavaScript desarrollado por Facebook. Es un framework "todo-en-uno" que incluye:

- Test runner
- Assertion library
- Mocking library
- Code coverage
- Snapshot testing

## 🚀 Instalación y Configuración

### Instalación

```bash
# Instalar Jest y tipos
npm install --save-dev jest @types/jest

# Instalar ts-jest para TypeScript
npm install --save-dev ts-jest

# Instalar @types/jest-environment-jsdom para testing de DOM
npm install --save-dev @types/jest-environment-jsdom
```

### Configuración Básica

Crear archivo `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

### Scripts en package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "jest --runInBand"
  }
}
```

## 🧪 Escribiendo Tests con Jest

### Estructura Básica

```typescript
describe("Mi función", () => {
  beforeAll(() => {
    // Se ejecuta una vez antes de todos los tests
  });

  afterAll(() => {
    // Se ejecuta una vez después de todos los tests
  });

  beforeEach(() => {
    // Se ejecuta antes de cada test
  });

  afterEach(() => {
    // Se ejecuta después de cada test
  });

  it("debe hacer algo", () => {
    // El test
  });
});
```

### Ejemplo Práctico

```typescript
// sumar.ts
export function sumar(a: number, b: number): number {
  return a + b;
}

// sumar.test.ts
import { sumar } from './sumar';

describe("sumar", () => {
  it("debe sumar dos números positivos", () => {
    expect(sumar(2, 3)).toBe(5);
  });

  it("debe sumar números negativos", () => {
    expect(sumar(-2, -3)).toBe(-5);
  });

  it("debe sumar cero", () => {
    expect(sumar(0, 0)).toBe(0);
  });

  it("debe manejar decimales", () => {
    expect(sumar(1.5, 2.5)).toBe(4);
  });
});
```

## 🎯 Assertions y Matchers

### Matchers Comunes

```typescript
// Igualdad
expect(valor).toBe(4);              // igualdad estricta (===)
expect(valor).toEqual({ a: 1 });   // igualdad profunda
expect(valor).not.toBe(5);          // negación

// Verdad/Falsedad
expect(valor).toBeTruthy();        // truthy
expect(valor).toBeFalsy();          // falsy
expect(valor).toBeNull();           // null
expect(valor).toBeUndefined();     // undefined
expect(valor).toBeDefined();       // no undefined

// Números
expect(valor).toBeGreaterThan(5);   // > 5
expect(valor).toBeLessThan(10);    // < 10
expect(valor).toBeCloseTo(0.3, 2); // ~0.3 con 2 decimales

// Strings
expect(texto).toMatch(/regex/);     // coincide con regex
expect(texto).toContain("texto");   // contiene substring

// Arrays
expect(array).toHaveLength(3);      // longitud
expect(array).toContain(item);      // contiene elemento
expect(array).toEqual([1, 2, 3]);  // igualdad

// Objetos
expect(objeto).toHaveProperty('nombre');  // tiene propiedad
expect(objeto).toMatchObject({ nombre: 'Juan' }); // coincide parcialmente

// Excepciones
expect(() => funcion()).toThrow();          // lanza excepción
expect(() => funcion()).toThrow(Error);   // lanza Error específico
expect(() => funcion()).toThrow("mensaje"); // lanza con mensaje
```

### Ejemplos de Matchers

```typescript
describe("Matchers", () => {
  const usuario = { 
    nombre: "Juan", 
    edad: 25, 
    email: "juan@test.com" 
  };
  const numeros = [1, 2, 3, 4, 5];

  it("debe verificar propiedades del objeto", () => {
    expect(usuario).toHaveProperty('nombre');
    expect(usuario).toHaveProperty('edad', 25);
  });

  it("debe verificar coincidencia parcial", () => {
    expect(usuario).toMatchObject({ nombre: "Juan" });
  });

  it("debe verificar arrays", () => {
    expect(numeros).toHaveLength(5);
    expect(numeros).toContain(3);
    expect(numeros).toEqual([1, 2, 3, 4, 5]);
  });

  it("debe verificar strings", () => {
    expect(usuario.email).toMatch(/@test\.com$/);
    expect(usuario.nombre).toContain("ua");
  });

  it("debe verificar números", () => {
    expect(usuario.edad).toBeGreaterThan(20);
    expect(usuario.edad).toBeLessThan(30);
  });
});
```

## 🎭 Mocks y Spies

### Mock Functions

```typescript
// Crear mock function
const mockFn = jest.fn();

// Usar mock function
mockFn('arg1', 'arg2');

// Verificar llamadas
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(1);
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenLastCalledWith('arg1', 'arg2');
```

### Mock Implementation

```typescript
// Mock con implementación personalizada
const mockFn = jest.fn((a, b) => a + b);

expect(mockFn(2, 3)).toBe(5);
```

### Mock Return Values

```typescript
// Mock que retorna valor específico
const mockFn = jest.fn();
mockFn.mockReturnValue(42);
expect(mockFn()).toBe(42);

// Mock que retorna valores secuenciales
mockFn.mockReturnValueOnce(10).mockReturnValueOnce(20);
expect(mockFn()).toBe(10);
expect(mockFn()).toBe(20);
```

### Mock Resolved Values (Promesas)

```typescript
// Mock que resuelve promesa
const asyncMock = jest.fn();
asyncMock.mockResolvedValue('resultado');

await expect(asyncMock()).resolves.toBe('resultado');
```

### Spying on Methods

```typescript
import { UsuarioService } from './usuario.service';

describe("UsuarioService", () => {
  it("debe llamar al método crear", () => {
    const service = new UsuarioService();
    const crearSpy = jest.spyOn(service, 'crear');
    
    service.crear({ nombre: 'Juan' });
    
    expect(crearSpy).toHaveBeenCalled();
    expect(crearSpy).toHaveBeenCalledWith({ nombre: 'Juan' });
    
    crearSpy.mockRestore(); // Restaurar implementación original
  });
});
```

### Mocking Modules

```typescript
// Mock de módulo completo
jest.mock('./api', () => ({
  fetchUsuario: jest.fn(() => Promise.resolve({ id: 1, nombre: 'Juan' }))
}));

// Mock parcial
jest.mock('./api', () => {
  const originalModule = jest.requireActual('./api');
  return {
    __esModule: true,
    ...originalModule,
    fetchUsuario: jest.fn(() => Promise.resolve({ id: 1 }))
  };
});
```

## 📸 Snapshot Testing

### ¿Qué es Snapshot Testing?

Guarda el resultado de un componente o función y lo compara con ejecuciones futuras para detectar cambios inesperados.

### Uso Básico

```typescript
import { formatearUsuario } from './utils';

describe("Snapshot Testing", () => {
  it("debe coincidir con el snapshot", () => {
    const usuario = { nombre: 'Juan', edad: 25 };
    const resultado = formatearUsuario(usuario);
    
    expect(resultado).toMatchSnapshot();
  });
});
```

### Inline Snapshots

```typescript
it("debe coincidir con el snapshot inline", () => {
  const usuario = { nombre: 'Juan', edad: 25 };
  const resultado = formatearUsuario(usuario);
  
  expect(resultado).toMatchInlineSnapshot(`
    "Juan (25 años)"
  `);
});
```

### Actualizar Snapshots

```bash
# Actualizar todos los snapshots
npm test -- -u

# Actualizar snapshot específico
npm test -- -t "debe coincidir con el snapshot" -u
```

## 🔧 Async Testing

### Testing Promesas

```typescript
describe("Async Testing", () => {
  it("debe resolver promesa", async () => {
    const resultado = await asyncFunction();
    expect(resultado).toBe('éxito');
  });

  it("debe rechazar promesa", async () => {
    await expect(asyncFunction()).rejects.toThrow('error');
  });

  it("debe resolver promesa con resolves", () => {
    return expect(asyncFunction()).resolves.toBe('éxito');
  });
});
```

### Testing Callbacks

```typescript
describe("Callback Testing", () => {
  it("debe llamar callback", (done) => {
    function callback(error, resultado) {
      expect(error).toBeNull();
      expect(resultado).toBe('éxito');
      done();
    }
    
    asyncFunction(callback);
  });
});
```

### Testing Timers

```typescript
describe("Timer Testing", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("debe ejecutar timeout", () => {
    const callback = jest.fn();
    
    setTimeout(callback, 1000);
    
    jest.advanceTimersByTime(1000);
    
    expect(callback).toHaveBeenCalled();
  });
});
```

## 📊 Code Coverage

### Ejecutar con Coverage

```bash
npm run test:coverage
```

### Configuración de Coverage

```javascript
module.exports = {
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/mocks/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Interpretar Coverage

- **Statements**: Porcentaje de sentencias ejecutadas
- **Branches**: Porcentaje de ramas condicionales ejecutadas
- **Functions**: Porcentaje de funciones llamadas
- **Lines**: Porcentaje de líneas ejecutadas

## 🎯 Buenas Prácticas con Jest

### 1. Tests Descriptivos

```typescript
// ❌ MAL
it("funciona", () => {
  expect(sumar(2, 2)).toBe(4);
});

// ✅ BIEN
it("debe sumar dos números positivos correctamente", () => {
  expect(sumar(2, 2)).toBe(4);
});
```

### 2. Tests Independientes

```typescript
// ❌ MAL: Tests con estado compartido
let contador = 0;

it("debe incrementar", () => {
  contador++;
  expect(contador).toBe(1);
});

it("debe ser 2", () => {
  expect(contador).toBe(2); // Depende del test anterior
});

// ✅ BIEN: Tests independientes
it("debe incrementar desde 0", () => {
  const contador = 0;
  contador++;
  expect(contador).toBe(1);
});
```

### 3. Mocks Claros

```typescript
// ❌ MAL: Mock confuso
const mock = jest.fn();
mock.mockImplementation((a) => a * 2);

// ✅ BIEN: Mock con nombre claro
const duplicarMock = jest.fn((a) => a * 2);
```

## 🎯 Resumen

- **Jest**: Framework de testing todo-en-uno para JavaScript/TypeScript
- **Configuración**: `jest.config.js` con preset `ts-jest`
- **Matchers**: `.toBe()`, `.toEqual()`, `.toMatch()`, etc.
- **Mocks**: `jest.fn()`, `jest.spyOn()`, `jest.mock()`
- **Async Testing**: `async/await`, `.resolves`, `.rejects`
- **Snapshots**: Guardan y comparan resultados
- **Coverage**: Medición de cobertura de código

## 📖 Recursos Adicionales

- [Jest Documentation](https://jestjs.io/)
- [Jest Matchers](https://jestjs.io/docs/expect)
- [Jest Mock Functions](https://jestjs.io/docs/mock-functions)
