export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string): AppError {
    return new AppError(message, 400);
  }

  static unauthorized(message: string = 'Não autorizado'): AppError {
    return new AppError(message, 401);
  }

  static forbidden(message: string = 'Acesso negado'): AppError {
    return new AppError(message, 403);
  }

  static notFound(message: string = 'Recurso não encontrado'): AppError {
    return new AppError(message, 404);
  }

  static conflict(message: string): AppError {
    return new AppError(message, 409);
  }

  static unprocessableEntity(message: string): AppError {
    return new AppError(message, 422);
  }

  static internalServer(message: string = 'Erro interno do servidor'): AppError {
    return new AppError(message, 500);
  }
}

