// Funciones matemáticas para practicar unit tests

export function sumar(a: number, b: number): number {
  return a + b;
}

export function restar(a: number, b: number): number {
  return a - b;
}

export function multiplicar(a: number, b: number): number {
  return a * b;
}

export function dividir(a: number, b: number): number {
  if (b === 0) {
    throw new Error("No se puede dividir por cero");
  }
  return a / b;
}

export function esPar(numero: number): boolean {
  return numero % 2 === 0;
}

export function esPositivo(numero: number): boolean {
  return numero > 0;
}

export function factorial(n: number): number {
  if (n < 0) {
    throw new Error("El factorial no está definido para números negativos");
  }
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

export function fibonacci(n: number): number {
  if (n < 0) {
    throw new Error("Fibonacci no está definido para números negativos");
  }
  if (n === 0) return 0;
  if (n === 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

export function maximo(...numeros: number[]): number {
  if (numeros.length === 0) {
    throw new Error("Se requiere al menos un número");
  }
  return Math.max(...numeros);
}

export function minimo(...numeros: number[]): number {
  if (numeros.length === 0) {
    throw new Error("Se requiere al menos un número");
  }
  return Math.min(...numeros);
}

export function promedio(...numeros: number[]): number {
  if (numeros.length === 0) {
    throw new Error("Se requiere al menos un número");
  }
  const suma = numeros.reduce((acc, num) => acc + num, 0);
  return suma / numeros.length;
}
