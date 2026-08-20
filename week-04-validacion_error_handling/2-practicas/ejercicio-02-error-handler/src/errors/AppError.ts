export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static notFound(message = "Recurso no encontrado") {
    return new AppError(message, 404, "NOT_FOUND");
  }

  static badRequest(message = "Solicitud inválida") {
    return new AppError(message, 400, "BAD_REQUEST");
  }

  static forbidden(message = "Acceso prohibido") {
    return new AppError(message, 403, "FORBIDDEN");
  }

  static internal(message = "Error interno del servidor") {
    return new AppError(message, 500, "INTERNAL_ERROR");
  }
}