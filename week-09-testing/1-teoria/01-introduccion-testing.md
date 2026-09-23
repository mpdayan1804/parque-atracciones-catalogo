# 01 - Introducción al Testing

## 🎯 Objetivos
- Entender qué es el testing y por qué es importante
- Conocer los diferentes tipos de tests
- Entender la pirámide de testing
- Aprender buenas prácticas de testing

## 📚 ¿Qué es Testing?

**Testing** es el proceso de verificar que el software funciona correctamente y cumple con los requisitos especificados.

### ¿Por qué Testear?

1. **Detectar bugs temprano**: Encontrar errores antes de que lleguen a producción
2. **Documentación**: Los tests sirven como documentación viva del código
3. **Refactorización segura**: Permite modificar código con confianza
4. **Mejor diseño**: El código testeable suele ser mejor diseñado
5. **Ahorro de tiempo**: Menos tiempo debugging en producción

## 🏗️ Tipos de Tests

### 1. Unit Tests (Tests Unitarios)

**Definición**: Tests que verifican el funcionamiento de una unidad individual de código (función, clase, método) de forma aislada.

**Características**:
- Prueban una sola funcionalidad
- Son rápidos de ejecutar
- No dependen de servicios externos
- Usan mocks para dependencias

**Ejemplo**:
```typescript
// Test unitario de una función
describe("sumar", () => {
  it("debe sumar dos números correctamente", () => {
    expect(sumar(2, 3)).toBe(5);
  });
  
  it("debe manejar números negativos", () => {
    expect(sumar(-2, 3)).toBe(1);
  });
});
```

### 2. Integration Tests (Tests de Integración)

**Definición**: Tests que verifican cómo diferentes unidades de código trabajan juntas.

**Características**:
- Prueban la interacción entre componentes
- Son más lentos que unit tests
- Pueden usar servicios reales o mocks
- Verifican la integración entre módulos

**Ejemplo**:
```typescript
// Test de integración de API
describe("POST /api/usuarios", () => {
  it("debe crear un usuario correctamente", async () => {
    const response = await request(app)
      .post("/api/usuarios")
      .send({ nombre: "Juan", email: "juan@test.com" });
    
    expect(response.status).toBe(201);
    expect(response.body.data.email).toBe("juan@test.com");
  });
});
```

### 3. End-to-End Tests (Tests E2E)

**Definición**: Tests que verifican el flujo completo de la aplicación desde la perspectiva del usuario.

**Características**:
- Simulan acciones reales del usuario
- Son los más lentos
- Prueban la aplicación completa
- Usan herramientas como Cypress, Playwright, Selenium

**Ejemplo**:
```typescript
// Test E2E con Cypress
describe("Flujo de registro", () => {
  it("debe permitir registro de nuevo usuario", () => {
    cy.visit("/registro");
    cy.get("[name='nombre']").type("Juan");
    cy.get("[name='email']").type("juan@test.com");
    cy.get("[name='password']").type("Pass123!");
    cy.get("button[type='submit']").click();
    cy.url().should("include", "/dashboard");
  });
});
```

## 🔺 Pirámide de Testing

La pirámide de testing es una guía para la proporción ideal de diferentes tipos de tests.

```
        ▲
       /E2E\          ~10% - Tests lentos, costosos
      /------\
     /Integration\   ~30% - Tests de integración
    /--------------\
   /   Unit Tests    \   ~60% - Tests rápidos, baratos
  /------------------\
```

**Recomendación**:
- **60% Unit Tests**: Rápidos, baratos, maintainables
- **30% Integration Tests**: Prueban integraciones clave
- **10% E2E Tests**: Prueban flujos críticos del usuario

## 🎯 Cuándo Usar Cada Tipo

### Unit Tests - Usar para:
- Lógica de negocio compleja
- Funciones puras
- Validaciones
- Transformaciones de datos
- Algoritmos

**No usar para**:
- Interacción con base de datos
- Llamadas a APIs externas
- Interacción con el sistema de archivos

### Integration Tests - Usar para:
- Interacción con base de datos
- Endpoints de API
- Integración entre servicios
- Flujos de autenticación
- Comunicación entre módulos

### E2E Tests - Usar para:
- Flujos críticos del usuario
- User journeys importantes
- Verificar la aplicación completa
- Testing cross-browser
- Verificar integración de sistemas

## 🛠️ Herramientas de Testing

### Para JavaScript/TypeScript

**Jest**: Framework de testing todo-en-uno
- Unit tests, integration tests
- Mocking, spying
- Code coverage
- Snapshot testing

**Supertest**: Testing de APIs HTTP
- Hacer requests HTTP
- Verificar respuestas
- Integración con Express

**Cypress**: Testing E2E
- Tests de navegador
- Time travel debugging
- Visuales y accesibilidad

**Mocha**: Framework de testing flexible
- Async testing
- Plugins extensibles
- Integración con otras herramientas

## 📊 Métricas de Testing

### Code Coverage (Cobertura de Código)

**Definición**: Porcentaje del código que es ejecutado durante los tests.

**Tipos de cobertura**:
- **Line Coverage**: Líneas de código ejecutadas
- **Branch Coverage**: Ramas condicionales ejecutadas
- **Function Coverage**: Funciones llamadas
- **Statement Coverage**: Sentencias ejecutadas

**Objetivos típicos**:
- Unit tests: 80%+ coverage
- Integration tests: 60%+ coverage
- E2E tests: 40%+ coverage

### Otras Métricas

- **Test Pass Rate**: Porcentaje de tests que pasan
- **Test Execution Time**: Tiempo total de ejecución
- **Flaky Tests**: Tests que fallan intermitentemente
- **Test Maintainability**: Facilidad de mantener los tests

## 🎓 Buenas Prácticas

### 1. Tests Independientes
```typescript
// ❌ MAL: Tests dependientes
describe("Usuario", () => {
  let usuarioId;
  
  it("debe crear usuario", () => {
    const usuario = crearUsuario();
    usuarioId = usuario.id;  // Depende del test anterior
  });
  
  it("debe eliminar usuario", () => {
    eliminarUsuario(usuarioId);  // Depende del test anterior
  });
});

// ✅ BIEN: Tests independientes
describe("Usuario", () => {
  it("debe crear usuario", () => {
    const usuario = crearUsuario();
    expect(usuario).toBeDefined();
  });
  
  it("debe eliminar usuario", () => {
    const usuario = crearUsuario();
    eliminarUsuario(usuario.id);
    expect(usuarioEliminado).toBe(true);
  });
});
```

### 2. Tests Descriptivos
```typescript
// ❌ MAL: Test poco descriptivo
it("funciona", () => {
  expect(sumar(2, 2)).toBe(4);
});

// ✅ BIEN: Test descriptivo
it("debe sumar dos números positivos correctamente", () => {
  expect(sumar(2, 2)).toBe(4);
});
```

### 3. Arrange-Act-Assert (AAA)
```typescript
describe("AuthService", () => {
  it("debe rechazar login con credenciales inválidas", async () => {
    // Arrange: Preparar el escenario
    const credencialesInvalidas = {
      email: "noexiste@test.com",
      password: "wrongpassword"
    };
    
    // Act: Ejecutar la acción
    const resultado = await authService.login(credencialesInvalidas);
    
    // Assert: Verificar el resultado
    expect(resultado).rejects.toThrow("Credenciales inválidas");
  });
});
```

### 4. Un Test, Una Aserción
```typescript
// ❌ MAL: Múltiples aserciones en un test
it("debe validar usuario", () => {
  expect(usuario.nombre).toBeDefined();
  expect(usuario.email).toBeDefined();
  expect(usuario.role).toBe("user");
  expect(usuario.createdAt).toBeDefined();
});

// ✅ BIEN: Un test, una aserción (o aserciones relacionadas)
it("debe tener nombre definido", () => {
  expect(usuario.nombre).toBeDefined();
});

it("debe tener email definido", () => {
  expect(usuario.email).toBeDefined();
});
```

### 5. Tests Rápidos
```typescript
// ❌ MAL: Tests lentos con delays
it("debe crear usuario", async () => {
  await delay(1000);  // Espera innecesaria
  const usuario = await crearUsuario();
  expect(usuario).toBeDefined();
});

// ✅ BIEN: Tests rápidos sin delays
it("debe crear usuario", async () => {
  const usuario = await crearUsuario();
  expect(usuario).toBeDefined();
});
```

## 🚫 Anti-Patterns de Testing

### 1. Testing Implementation Details
```typescript
// ❌ MAL: Probar implementación interna
it("debe usar array para almacenar usuarios", () => {
  expect(usuarioService.usuarios).toBeInstanceOf(Array);
});

// ✅ BIEN: Probar comportamiento observable
it("debe poder agregar usuarios", () => {
  usuarioService.agregar(usuario);
  expect(usuarioService.obtenerTodos()).toContain(usuario);
});
```

### 2. Fragile Tests
```typescript
// ❌ MAL: Tests frágiles que dependen de orden
it("debe ser el primer usuario", () => {
  expect(usuarioService.obtener(0).nombre).toBe("Juan");
});

// ✅ BIEN: Tests robustos
it("debe encontrar usuario por nombre", () => {
  const usuario = usuarioService.buscarPorNombre("Juan");
  expect(usuario).toBeDefined();
});
```

### 3. Tests que no prueban nada
```typescript
// ❌ MAL: Test que siempre pasa
it("debe funcionar", () => {
  expect(true).toBe(true);
});

// ✅ BIEN: Test que verifica algo real
it("debe validar email correctamente", () => {
  expect(validarEmail("invalido")).toBe(false);
});
```

## 🎯 Resumen

- **Testing**: Verificar que el software funciona correctamente
- **Unit Tests**: Prueban unidades individuales, rápidos, aislados
- **Integration Tests**: Prueban integración entre componentes
- **E2E Tests**: Prueban flujos completos del usuario
- **Pirámide de Testing**: 60% unit, 30% integration, 10% E2E
- **Buenas Prácticas**: Tests independientes, descriptivos, rápidos
- **AAA Pattern**: Arrange, Act, Assert

## 📖 Recursos Adicionales

- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](https://testingjavascript.com/)
- [Test Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
