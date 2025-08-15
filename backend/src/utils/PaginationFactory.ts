export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export class PaginationFactory {
  private static readonly DEFAULT_PAGE = 1;
  private static readonly DEFAULT_LIMIT = 10;
  private static readonly MAX_LIMIT = 100;

  static createOptions(options: PaginationOptions = {}): Required<PaginationOptions> {
    const page = Math.max(1, options.page || this.DEFAULT_PAGE);
    const limit = Math.min(
      Math.max(1, options.limit || this.DEFAULT_LIMIT),
      this.MAX_LIMIT
    );
    const sortBy = options.sortBy || 'created_at';
    const sortOrder = options.sortOrder || 'DESC';

    return { page, limit, sortBy, sortOrder };
  }

  static createResult<T>(
    items: T[],
    total: number,
    page: number,
    limit: number
  ): PaginatedResult<T> {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      items,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev,
    };
  }

  static getSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static validatePaginationParams(page?: number, limit?: number): void {
    if (page !== undefined && (page < 1 || !Number.isInteger(page))) {
      throw new Error('Página deve ser um número inteiro maior que 0');
    }

    if (limit !== undefined && (limit < 1 || limit > this.MAX_LIMIT || !Number.isInteger(limit))) {
      throw new Error(`Limite deve ser um número inteiro entre 1 e ${this.MAX_LIMIT}`);
    }
  }
}

