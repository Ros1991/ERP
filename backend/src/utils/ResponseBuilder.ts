export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class ResponseBuilder {
  static success<T>(data: T, message: string = 'Operação realizada com sucesso'): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  static successWithPagination<T>(
    data: T,
    pagination: ApiResponse['pagination'],
    message: string = 'Dados recuperados com sucesso'
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      pagination,
    };
  }

  static error(message: string, errors?: string[]): ApiResponse {
    return {
      success: false,
      message,
      errors,
    };
  }

  static validationError(errors: string[]): ApiResponse {
    return {
      success: false,
      message: 'Dados inválidos',
      errors,
    };
  }

  static notFound(message: string = 'Recurso não encontrado'): ApiResponse {
    return {
      success: false,
      message,
    };
  }

  static unauthorized(message: string = 'Não autorizado'): ApiResponse {
    return {
      success: false,
      message,
    };
  }

  static forbidden(message: string = 'Acesso negado'): ApiResponse {
    return {
      success: false,
      message,
    };
  }

  static conflict(message: string): ApiResponse {
    return {
      success: false,
      message,
    };
  }
}

