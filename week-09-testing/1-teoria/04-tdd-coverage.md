# 04 - TDD y Code Coverage

## 🎯 Objetivos
- Entender el concepto de TDD (Test-Driven Development)
- Aplicar el ciclo Red-Green-Refactor
- Medir y mejorar la cobertura de código
- Entender los objetivos realistas de coverage
- Aplicar TDD en el proyecto del Parque de Atracciones

## 📚 ¿Qué es TDD?

**TDD (Test-Driven Development)** es una metodología de desarrollo donde los tests se escriben antes que el código de producción.

### Filosofía de TDD

1. **Escribir un test que falle** (Red)
2. **Escribir el mínimo código para que pase** (Green)
3. **Refactorizar el código** (Refactor)

### Ciclo Red-Green-Refactor

```
┌─────────────┐
│    RED     │ ← Escribir test que falla
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   GREEN     │ ← Escribir código mínimo para pasar
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  REFACTOR    │ ← Mejorar código sin romper tests
└──────┬──────┘
       │
       └──────→ (Volver a RED)
```

## 🚀 Implementando TDD

### Ejemplo Práctico: Función de Validación de Email

#### Paso 1: RED - Escribir test que falla

```typescript
// email-validator.test.ts
describe("validarEmail", () => {
  it("debe retornar true para email válido", () => {
    expect(validarEmail("juan@test.com")).toBe(true);
  });
});
```

```bash
# Ejecutar test - DEBE FALLAR
npm test

# Error: ReferenceError: validarEmail is not defined
```

#### Paso 2: GREEN - Escribir código mínimo para pasar

```typescript
// email-validator.ts
export function validarEmail(email: string): boolean {
  return email.includes("@"); // Implementación mínima
}
```

```bash
# Ejecutar test - DEBE PASAR
npm test

# ✓ debe retornar true para email válido
```

#### Paso 3: REFACTOR - Mejorar implementación

```typescript
// email-validator.ts
export function validarEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

```bash
# Ejecutar test - DEBE SEGUIR PASANDO
npm test

# ✓ debe retornar true para email válido
```

#### Paso 4: RED - Agregar más casos

```typescript
describe("validarEmail", () => {
  it("debe retornar true para email válido", () => {
    expect(validarEmail("juan@test.com")).toBe(true);
  });

  it("debe retornar false para email sin @", () => {
    expect(validarEmail("juantest.com")).toBe(false);
  });

  it("debe retornar false para email vacío", () => {
    expect(validarEmail("")).toBe(false);
  });
});
```

```bash
# Ejecutar tests - DEBEN FALLAR los nuevos
npm test

# ✗ debe retornar false para email sin @
# ✗ debe retornar false para email vacío
```

#### Paso 5: GREEN - Mejorar implementación

```typescript
// email-validator.ts
export function validarEmail(email: string): boolean {
  if (!email || email.trim() === "") {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

```bash
# Ejecutar tests - DEBEN PASAR TODOS
npm test

# ✓ debe retornar true para email válido
# ✓ debe retornar false para email sin @
# ✓ debe retornar false para email vacío
```

## 🎯 Ventajas de TDD

### 1. Diseño Mejor

El código testeable tiende a ser mejor diseñado:

```typescript
// ❌ MAL: Código difícil de testear
class UsuarioService {
  crearUsuario(datos: any) {
    // Lógica compleja mezclada con DB
    const usuario = new Usuario(datos);
    usuario.save();
    this.enviarEmail(usuario);
    this.logAudit(usuario);
    return usuario;
  }
}

// ✅ BIEN: Código fácil de testear (TDD)
class UsuarioService {
  constructor(
    private usuarioRepository: UsuarioRepository,
    private emailService: EmailService,
    private auditService: AuditService
  ) {}

  async crearUsuario(datos: any) {
    const usuario = await this.usuarioRepository.crear(datos);
    await this.emailService.enviarBienvenida(usuario);
    await this.auditService.logCreacion(usuario);
    return usuario;
  }
}
```

### 2. Documentación Viva

Los tests sirven como documentación:

```typescript
describe("AuthService", () => {
  describe("login", () => {
    it("debe retornar token para credenciales válidas", () => {
      // Este test documenta cómo funciona el login
    });

    it("debe lanzar error para credenciales inválidas", () => {
      // Este test documenta el manejo de errores
    });
  });
});
```

### 3. Refactorización Segura

Puedes refactorizar con confianza:

```typescript
// Antes de refactorizar
it("debe calcular descuento", () => {
  expect(calcularDescuento(100, 0.1)).toBe(10);
});

// Refactorizar el código
// Los tests aseguran que no rompiste nada
```

### 4. Bugs Menos Frecuentes

Los tests catchean bugs temprano:

```typescript
// Test descubre bug
it("debe manejar edge case de cero", () => {
  expect(dividir(10, 0)).toThrow("No se puede dividir por cero");
});
```

## 🎯 Desventajas de TDD

### 1. Curva de Aprendizaje

Requiere tiempo para acostumbrarse al ciclo.

### 2. Más Tiempo Inicial

Al principio parece más lento, pero ahorra tiempo después.

### 3. No Siempre Apropiado

- Para prototipos rápidos
- Para UI experimental
- Para investigación técnica

## 📊 Code Coverage

### ¿Qué es Code Coverage?

**Code Coverage** es el porcentaje de código que es ejecutado durante los tests.

### Tipos de Coverage

#### 1. Line Coverage (Cobertura de Líneas)

Porcentaje de líneas de código ejecutadas.

```typescript
function procesar(valor: number) {
  if (valor > 0) {      // Línea 1
    return valor * 2;   // Línea 2
  }                     // Línea 3
  return valor;         // Línea 4
}

// Test: procesar(5)
// Line coverage: 75% (líneas 1,2,4 ejecutadas, línea 3 no)
```

#### 2. Branch Coverage (Cobertura de Ramas)

Porcentaje de ramas condicionales ejecutadas.

```typescript
if (valor > 0) {    // Rama true
  return valor * 2;
} else {            // Rama false
  return valor;
}

// Test: procesar(5)
// Branch coverage: 50% (solo rama true ejecutada)
```

#### 3. Function Coverage (Cobertura de Funciones)

Porcentaje de funciones llamadas.

```typescript
function funcionA() {}
function funcionB() {}

// Test: solo llama funcionA()
// Function coverage: 50%
```

#### 4. Statement Coverage (Cobertura de Sentencias)

Similar a line coverage pero a nivel de sentencias.

### Configurar Coverage en Jest

```javascript
// jest.config.js
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/mocks/**',
    '!src/types/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: ['text', 'lcov', 'html']
};
```

### Ejecutar Coverage

```bash
# Ejecutar tests con coverage
npm run test:coverage

# Ver reporte HTML
open coverage/lcov-report/index.html
```

### Interpretar Coverage

```
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |    85.5 |     82.3 |    88.9 |    85.5 |
 authService.ts |   100 |      100 |     100 |     100 |
 usuarioService.ts |   72.5 |      65 |     75 |    72.5 | 25-30,45-50
----------|---------|----------|---------|---------|-------------------
```

## 🎯 Objetivos Realistas de Coverage

### Por Objetivo del Proyecto

**Librerías Open Source**: 90%+ coverage
- Alta confianza requerida
- Muchos usuarios

**Aplicaciones Empresariales**: 80%+ coverage
- Buen balance costo/beneficio
- Crítico cubrir lógica de negocio

**Prototipos/MVP**: 60%+ coverage
- Foco en funcionalidad crítica
- Iteración rápida

### Por Tipo de Código

**Lógica de Negocio**: 90%+ coverage
- Funciones puras
- Algoritmos complejos
- Validaciones

**Controllers/Routes**: 70%+ coverage
- Testing de integración
- Casos normales y edge cases

**Utilidades/Helpers**: 95%+ coverage
- Fáciles de testear
- Alto impacto si fallan

**Configuración**: 50%+ coverage
- Menos crítico
- Difícil de testear completamente

## 🚫 Mitos sobre Coverage

### Mito 1: "100% Coverage Significa Código Sin Bugs"

**Realidad**: Coverage mide qué código se ejecuta, no si es correcto.

```typescript
function sumar(a: number, b: number): number {
  return a - b; // Bug: resta en lugar de sumar
}

// Test: sumar(2, 2) → 0
// Coverage: 100%, pero el código tiene bug
```

### Mito 2: "Alto Coverage Significa Tests Buenos"

**Realidad**: Puedes tener 100% coverage con tests mal escritos.

```typescript
// Test mal escrito
it("debe funcionar", () => {
  expect(true).toBe(true); // Coverage 100%, pero no prueba nada
});
```

### Mito 3: "Coverage Es una Métrica de Calidad"

**Realidad**: Coverage es una métrica de cantidad, no de calidad.

## 🎯 Buenas Prácticas de Coverage

### 1. Enfocarse en Riesgo

```typescript
// ✅ BIEN: Priorizar coverage en código crítico
describe("AuthService", () => {
  // Tests exhaustivos de login (crítico)
  it("debe validar credenciales");
  it("debe generar token JWT");
  it("debe manejar tokens expirados");
  // ...
});

// ❌ MAL: Enfocarse en código trivial
describe("utilidades", () => {
  // Tests excesivos de funciones simples
  it("debe sumar 1 + 1");
  it("debe sumar 2 + 2");
  // ...
});
```

### 2. Coverage por Componente

```javascript
// jest.config.js
coverageThreshold: {
  './src/services/': {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90
  },
  './src/controllers/': {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70
  },
  './src/utils/': {
    branches: 95,
    functions: 95,
    lines: 95,
    statements: 95
  }
}
```

### 3. Revisar Code Coverage Reports

```bash
# Generar reporte HTML
npm run test:coverage

# Revisar manualmente líneas no cubiertas
# ¿Son edge cases importantes?
# ¿Son código muerto?
# ¿Son manejo de errores crítico?
```

## 🧪 TDD en el Proyecto del Parque de Atracciones

### Ejemplo: Crear Atracción con TDD

#### RED - Test de creación

```typescript
// atraccion.service.test.ts
describe("AtraccionService", () => {
  describe("crear", () => {
    it("debe crear atracción con datos válidos", async () => {
      const datos = {
        nombre: "Montaña Rusa",
        descripcion: "Atracción emocionante",
        categoria: "montana_rusa",
        capacidad: 20,
        precio: 25
      };

      const resultado = await atraccionService.crear(datos);

      expect(resultado).toHaveProperty("_id");
      expect(resultado.nombre).toBe(datos.nombre);
      expect(resultado.categoria).toBe(datos.categoria);
    });
  });
});
```

#### GREEN - Implementación mínima

```typescript
// atraccion.service.ts
export class AtraccionService {
  async crear(datos: any) {
    const atraccion = new Atraccion(datos);
    return await atraccion.save();
  }
}
```

#### REFACTOR - Agregar validación

```typescript
// atraccion.service.test.ts (nuevo test)
it("debe rechazar atracción con nombre inválido", async () => {
  const datos = {
    nombre: "Mo", // Muy corto
    descripcion: "Test",
    categoria: "montana_rusa",
    capacidad: 20,
    precio: 25
  };

  await expect(atraccionService.crear(datos)).rejects.toThrow();
});
```

```typescript
// atraccion.service.ts (refactorizado)
export class AtraccionService {
  async crear(datos: any) {
    if (datos.nombre.length < 3) {
      throw new Error("El nombre debe tener al menos 3 caracteres");
    }
    
    const atraccion = new Atraccion(datos);
    return await atraccion.save();
  }
}
```

## 🎯 Estrategias de Testing

### 1. Testing Pyramid Aplicado

``<arg_value>Unit Tests (60%)
├── Services
├── Repositories
├── Utils
└── Validators

Integration Tests (30%)
├── Controllers
├── Routes
└── Middlewares

E2E Tests (10%)
├── Flujos críticos
└── User journeys
```

### 2. Testing por Capa

```typescript
// Unit: Service (sin DB)
describe("AuthService (Unit)", () => {
  it("debe generar token JWT", () => {
    const token = authService.generarToken({ id: "1", email: "test@test.com" });
    expect(token).toBeDefined();
  });
});

// Integration: Service (con DB en memoria)
describe("AuthService (Integration)", () => {
  it("debe registrar usuario en DB", async () => {
    const usuario = await authService.registrar(datos);
    const encontrado = await Usuario.findById(usuario.id);
    expect(encontrado).toBeDefined();
  });
});

// E2E: API completa
describe("POST /auth/register (E2E)", () => {
  it("debe crear usuario y retornar token", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(datos);
    
    expect(response.status).toBe(201);
    expect(response.body.data.token).toBeDefined();
  });
});
```

## 🎯 Resumen

- **TDD**: Tests antes que código, ciclo Red-Green-Refactor
- **Ventajas**: Mejor diseño, documentación viva, refactorización segura
- **Code Coverage**: Porcentaje de código ejecutado en tests
- **Tipos**: Line, Branch, Function, Statement coverage
- **Objetivos**: 80%+ es buen objetivo, 100% no siempre necesario
- **Mitos**: Coverage ≠ calidad, 100% ≠ sin bugs
- **Buenas Prácticas**: Enfocarse en riesgo, coverage por componente

## 📖 Recursos Adicionales

- [Test Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- [Jest Coverage](https://jestjs.io/docs/configuration#collectcoverage-boolean)
- [Code Coverage Best Practices](https://martinfowler.com/bliki/TestCoverage.html)
