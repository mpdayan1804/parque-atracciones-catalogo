import { 
  sumar, 
  restar, 
  multiplicar, 
  dividir, 
  esPar, 
  esPositivo, 
  factorial, 
  fibonacci, 
  maximo, 
  minimo, 
  promedio 
} from './calculadora';

describe("Calculadora - Operaciones Básicas", () => {
  describe("sumar", () => {
    it("debe sumar dos números positivos", () => {
      expect(sumar(2, 3)).toBe(5);
    });

    it("debe sumar números negativos", () => {
      expect(sumar(-2, -3)).toBe(-5);
    });

    it("debe sumar positivo y negativo", () => {
      expect(sumar(5, -3)).toBe(2);
    });

    it("debe sumar cero", () => {
      expect(sumar(0, 0)).toBe(0);
    });

    it("debe sumar decimales", () => {
      expect(sumar(1.5, 2.5)).toBe(4);
    });
  });

  describe("restar", () => {
    it("debe restar dos números positivos", () => {
      expect(restar(5, 3)).toBe(2);
    });

    it("debe restar números negativos", () => {
      expect(restar(-5, -3)).toBe(-2);
    });

    it("debe restar cero", () => {
      expect(restar(5, 0)).toBe(5);
    });
  });

  describe("multiplicar", () => {
    it("debe multiplicar dos números positivos", () => {
      expect(multiplicar(3, 4)).toBe(12);
    });

    it("debe multiplicar por cero", () => {
      expect(multiplicar(5, 0)).toBe(0);
    });

    it("debe multiplicar números negativos", () => {
      expect(multiplicar(-2, -3)).toBe(6);
    });

    it("debe multiplicar positivo y negativo", () => {
      expect(multiplicar(2, -3)).toBe(-6);
    });
  });

  describe("dividir", () => {
    it("debe dividir dos números positivos", () => {
      expect(dividir(10, 2)).toBe(5);
    });

    it("debe dividir números negativos", () => {
      expect(dividir(-10, -2)).toBe(5);
    });

    it("debe dividir positivo por negativo", () => {
      expect(dividir(10, -2)).toBe(-5);
    });

    it("debe manejar división con decimales", () => {
      expect(dividir(7, 2)).toBe(3.5);
    });

    it("debe lanzar error al dividir por cero", () => {
      expect(() => dividir(10, 0)).toThrow("No se puede dividir por cero");
    });
  });
});

describe("Calculadora - Validaciones", () => {
  describe("esPar", () => {
    it("debe retornar true para números pares", () => {
      expect(esPar(2)).toBe(true);
      expect(esPar(4)).toBe(true);
      expect(esPar(0)).toBe(true);
    });

    it("debe retornar false para números impares", () => {
      expect(esPar(1)).toBe(false);
      expect(esPar(3)).toBe(false);
      expect(esPar(5)).toBe(false);
    });

    it("debe manejar números negativos", () => {
      expect(esPar(-2)).toBe(true);
      expect(esPar(-3)).toBe(false);
    });
  });

  describe("esPositivo", () => {
    it("debe retornar true para números positivos", () => {
      expect(esPositivo(5)).toBe(true);
      expect(esPositivo(0.1)).toBe(true);
    });

    it("debe retornar false para cero", () => {
      expect(esPositivo(0)).toBe(false);
    });

    it("debe retornar false para números negativos", () => {
      expect(esPositivo(-5)).toBe(false);
      expect(esPositivo(-0.1)).toBe(false);
    });
  });
});

describe("Calculadora - Funciones Recursivas", () => {
  describe("factorial", () => {
    it("debe calcular factorial de 0", () => {
      expect(factorial(0)).toBe(1);
    });

    it("debe calcular factorial de 1", () => {
      expect(factorial(1)).toBe(1);
    });

    it("debe calcular factorial de 5", () => {
      expect(factorial(5)).toBe(120);
    });

    it("debe calcular factorial de 10", () => {
      expect(factorial(10)).toBe(3628800);
    });

    it("debe lanzar error para números negativos", () => {
      expect(() => factorial(-1)).toThrow("El factorial no está definido para números negativos");
    });
  });

  describe("fibonacci", () => {
    it("debe calcular fibonacci de 0", () => {
      expect(fibonacci(0)).toBe(0);
    });

    it("debe calcular fibonacci de 1", () => {
      expect(fibonacci(1)).toBe(1);
    });

    it("debe calcular fibonacci de 5", () => {
      expect(fibonacci(5)).toBe(5);
    });

    it("debe calcular fibonacci de 10", () => {
      expect(fibonacci(10)).toBe(55);
    });

    it("debe lanzar error para números negativos", () => {
      expect(() => fibonacci(-1)).toThrow("Fibonacci no está definido para números negativos");
    });
  });
});

describe("Calculadora - Funciones con Arrays", () => {
  describe("maximo", () => {
    it("debe encontrar el máximo de dos números", () => {
      expect(maximo(5, 3)).toBe(5);
    });

    it("debe encontrar el máximo de múltiples números", () => {
      expect(maximo(1, 5, 3, 2, 4)).toBe(5);
    });

    it("debe manejar números negativos", () => {
      expect(maximo(-1, -5, -3)).toBe(-1);
    });

    it("debe lanzar error sin argumentos", () => {
      expect(() => maximo()).toThrow("Se requiere al menos un número");
    });
  });

  describe("minimo", () => {
    it("debe encontrar el mínimo de dos números", () => {
      expect(minimo(3, 5)).toBe(3);
    });

    it("debe encontrar el mínimo de múltiples números", () => {
      expect(minimo(5, 1, 3, 2, 4)).toBe(1);
    });

    it("debe manejar números negativos", () => {
      expect(minimo(-1, -5, -3)).toBe(-5);
    });

    it("debe lanzar error sin argumentos", () => {
      expect(() => minimo()).toThrow("Se requiere al menos un número");
    });
  });

  describe("promedio", () => {
    it("debe calcular promedio de dos números", () => {
      expect(promedio(2, 4)).toBe(3);
    });

    it("debe calcular promedio de múltiples números", () => {
      expect(promedio(1, 2, 3, 4, 5)).toBe(3);
    });

    it("debe calcular promedio con decimales", () => {
      expect(promedio(1, 2)).toBe(1.5);
    });

    it("debe lanzar error sin argumentos", () => {
      expect(() => promedio()).toThrow("Se requiere al menos un número");
    });
  });
});
