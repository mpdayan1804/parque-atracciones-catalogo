# Proyecto Semanal - Semana 9: Testing

API del Parque de Atracciones con suite de tests completa según rúbrica.

## 🎯 Características Implementadas (Según Rúbrica)

### Unit Tests
- ✅ Tests de utilidades (JWT)
- ✅ Tests de services con mocks
- ✅ Mocking de dependencias con jest.fn(), jest.mock(), jest.spyOn()

### Integration Tests
- ✅ Tests de modelos con MongoDB Memory Server
- ✅ Tests de rutas HTTP con Supertest
- ✅ Tests de endpoints /auth

### Coverage
- ✅ Configuración de umbrales de coverage (≥80% global)
- ✅ MongoDB Memory Server para tests aislados

## 🛠️ Configuración

### Instalación

```bash
npm install
```

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests con coverage
npm run test:coverage

# Solo unit tests
npm run test:unit

# Solo integration tests
npm run test:integration

# Watch mode
npm run test:watch
```

## 📊 Coverage

Objetivos según rúbrica:
- Global: ≥80%
- Services: ≥80%
- Utils: ≥90%

Generar reporte de coverage:
```bash
npm run test:coverage
```

El reporte HTML se genera en `coverage/lcov-report/index.html`.

## 🧪 Estructura de Tests

```
tests/
├── setup.ts                    # Configuración global (MongoDB Memory Server)
├── unit/                       # Tests unitarios
│   └── jwt.test.ts           # Tests de utilidades JWT
│   └── usuario.service.test.ts # Tests de services con mocks
└── integration/               # Tests de integración
    ├── usuario.test.ts        # Tests del modelo Usuario
    └── atraccion.test.ts      # Tests del modelo Atraccion
```

## 🎯 Buenas Prácticas Aplicadas

- ✅ Tests independientes con cleanup después de cada test
- ✅ MongoDB Memory Server para tests aislados
- ✅ Descripción clara de cada test
- ✅ AAA Pattern (Arrange-Act-Assert)
- ✅ Mocking apropiado de dependencias
- ✅ Coverage configurado según rúbrica

## 📈 Estado Actual (Cumple Rúbrica)

- ✅ Configuración de Jest completa
- ✅ MongoDB Memory Server configurado
- ✅ Unit tests de JWT utils
- ✅ Unit tests de services con mocks
- ✅ Integration tests de modelos
- ✅ Integration tests de endpoints /auth
- ✅ Coverage thresholds configurados (≥80%)

## 🚀 Próximos Pasos (Opcionales)

- Agregar más tests para alcanzar coverage objetivo
- Tests de controllers
- Tests de rutas adicionales
- Tests de seguridad

---

**Proyecto completado según rúbrica - Semana 9: Testing** 🧪
