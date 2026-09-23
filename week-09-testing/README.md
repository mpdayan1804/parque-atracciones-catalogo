# Semana 09 — Testing

## 🎯 Objetivos de Aprendizaje

Al finalizar esta semana, el estudiante será capaz de:
- Escribir **tests unitarios** con Jest
- Implementar **tests de integración** con Supertest
- Crear **mocks** para dependencias externas
- Medir **cobertura de código** (code coverage)
- Aplicar **TDD** (Test-Driven Development)
- Entender la diferencia entre **unit tests**, **integration tests** y **E2E tests**
- Implementar tests para el proyecto del Parque de Atracciones

## 📚 Requisitos Previos
- ✅ Semana 08 completa: Autorización y seguridad
- ✅ Familiaridad con el proyecto del Parque de Atracciones
- ✅ Conocimiento básico de JavaScript/TypeScript

## 🗂️ Estructura de la Semana

```
week-09-testing/
├── README.md
├── 1-teoria/
│   ├── 01-introduccion-testing.md
│   ├── 02-jest-framework.md
│   ├── 03-testing-apis-supertest.md
│   └── 04-tdd-coverage.md
├── 2-practicas/
│   ├── ejercicio-01-unit-tests/
│   └── ejercicio-02-integration-tests/
├── 3-proyecto/
├── 4-recursos/
│   ├── ebooks-free/
│   ├── videografia/
│   └── webgrafia/
└── 5-glosario/
```

## 📝 Contenidos

### Teoría

| Archivo | Tema | Descripción |
|---------|------|-------------|
| 01-introduccion-testing.md | Introducción al Testing | Tipos de tests, por qué testear, pirámide de testing |
| 02-jest-framework.md | Jest Framework | Setup, assertions, mocks, snapshots |
| 03-testing-apis-supertest.md | Testing APIs | Supertest, testing de endpoints HTTP |
| 04-tdd-coverage.md | TDD y Coverage | Test-Driven Development, medición de cobertura |

### Prácticas

| Ejercicio | Tema | Descripción |
|-----------|------|-------------|
| ejercicio-01-unit-tests | Unit Tests | Tests unitarios de funciones y servicios |
| ejercicio-02-integration-tests | Integration Tests | Tests de integración de APIs con Supertest |

### Proyecto Semanal

**Dominio**: Parque de Atracciones con suite de tests completa

**Implementación**:
- Tests unitarios de services y repositories
- Tests de integración de controllers y rutas
- Tests de seguridad (RBAC, rate limiting, etc.)
- Configuración de Jest y Supertest
- Medición de cobertura de código

## ⏱️ Distribución del Tiempo (8 horas)

| Actividad | Tiempo |
|-----------|--------|
| Teoría (4 archivos) | 2h |
| Ejercicio 01: Unit Tests | 2h |
| Ejercicio 02: Integration Tests | 2h |
| Proyecto semanal | 2h |

## 📌 Entregables

1. Ejercicio 01 funcionando: Suite de tests unitarios con Jest
2. Ejercicio 02 funcionando: Tests de integración con Supertest
3. Proyecto semanal: Tests completos para el API del Parque de Atracciones

## 🔗 Navegación

← [Semana 08: Autorización y Seguridad](../week-08-autorizacion_seguridad/README.md) | [Semana 10 →](../week-10/README.md)

---

**¡Comencemos con Testing!** 🧪
