import { Request, Response } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass, ClassConstructor } from 'class-transformer';
import { ResponseBuilder } from '../utils/ResponseBuilder';
import { AppError } from '../utils/AppError';
import { PaginationFactory } from '../utils/PaginationFactory';

export interface ServiceMethod<T = any> {
  (...args: any[]): Promise<T>;
}

export abstract class BaseController {
  /**
   * Método genérico para lidar com validação e execução de métodos de serviço com DTO
   */
  protected async handleRequest<TDto, TResult>(
    req: Request,
    res: Response,
    options: {
      serviceMethod: ServiceMethod<TResult>;
      serviceArgs?: any[];
      successMessage: string;
      successStatus?: number;
      source?: 'body' | 'query' | 'params';
      dtoClass?: ClassConstructor<TDto>;
      validateDto?: boolean;
    }
  ): Promise<void>;

  /**
   * Método genérico para lidar com execução de métodos de serviço sem validação de DTO
   */
  protected async handleRequest<TResult>(
    req: Request,
    res: Response,
    options: {
      serviceMethod: ServiceMethod<TResult>;
      serviceArgs?: any[];
      successMessage: string;
      successStatus?: number;
    }
  ): Promise<void>;

  protected async handleRequest<TDto, TResult>(
    req: Request,
    res: Response,
    options: {
      serviceMethod: ServiceMethod<TResult>;
      serviceArgs?: any[];
      successMessage: string;
      successStatus?: number;
      source?: 'body' | 'query' | 'params';
      dtoClass?: ClassConstructor<TDto>;
      validateDto?: boolean;
    }
  ): Promise<void> {
    try {
      const {
        serviceMethod,
        serviceArgs = [],
        successMessage,
        successStatus = 200,
        source = 'body',
        dtoClass,
        validateDto = false
      } = options;

      // Obter dados da fonte da requisição
      const sourceData = source === 'query' ? req.query : 
                        source === 'params' ? req.params : req.body;
      
      let validatedData = sourceData;

      // Validar DTO se especificado
      if (validateDto && dtoClass) {
        validatedData = await this.validateDto(sourceData, dtoClass);
      }

      // Executar método do serviço
      const result = await serviceMethod(validatedData as TDto, ...serviceArgs);

      // Enviar resposta de sucesso
      res.status(successStatus).json(ResponseBuilder.success(result, successMessage));

    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * Lidar com requisições com validação de ID
   */
  protected async handleRequestWithId<TResult>(
    req: Request,
    res: Response,
    options: {
      serviceMethod: ServiceMethod<TResult>;
      serviceArgs?: any[];
      successMessage: string;
      successStatus?: number;
      idParam?: string;
      idType?: 'string' | 'number';
    }
  ): Promise<void> {
    try {
      const {
        serviceMethod,
        serviceArgs = [],
        successMessage,
        successStatus = 200,
        idParam = 'id',
        idType = 'string'
      } = options;

      const idValue = req.params[idParam];
      
      if (!idValue) {
        throw AppError.badRequest('ID não fornecido');
      }

      let parsedId: string | number = idValue;
      
      if (idType === 'number') {
        parsedId = parseInt(idValue, 10);
        if (isNaN(parsedId)) {
          throw AppError.badRequest('ID deve ser um número válido');
        }
      }

      const result = await serviceMethod(parsedId, ...serviceArgs);

      res.status(successStatus).json(ResponseBuilder.success(result, successMessage));

    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * Lidar com requisições com ID e DTO
   */
  protected async handleRequestWithIdAndDto<TDto, TResult>(
    req: Request,
    res: Response,
    options: {
      serviceMethod: ServiceMethod<TResult>;
      serviceArgs?: any[];
      successMessage: string;
      successStatus?: number;
      idParam?: string;
      idType?: 'string' | 'number';
      dtoClass?: ClassConstructor<TDto>;
      validateDto?: boolean;
    }
  ): Promise<void> {
    try {
      const {
        serviceMethod,
        serviceArgs = [],
        successMessage,
        successStatus = 200,
        idParam = 'id',
        idType = 'string',
        dtoClass,
        validateDto = false
      } = options;

      const idValue = req.params[idParam];
      
      if (!idValue) {
        throw AppError.badRequest('ID não fornecido');
      }

      let parsedId: string | number = idValue;
      
      if (idType === 'number') {
        parsedId = parseInt(idValue, 10);
        if (isNaN(parsedId)) {
          throw AppError.badRequest('ID deve ser um número válido');
        }
      }

      let validatedData = req.body;

      // Validar DTO se especificado
      if (validateDto && dtoClass) {
        validatedData = await this.validateDto(req.body, dtoClass);
      }

      const result = await serviceMethod(parsedId, validatedData as TDto, ...serviceArgs);

      res.status(successStatus).json(ResponseBuilder.success(result, successMessage));

    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * Método genérico para lidar com requisições de listagem com paginação e filtros
   */
  protected async handleListRequest<TFilterRequest>(
    req: Request,
    res: Response,
    options: {
      serviceMethod: ServiceMethod;
      successMessage: string;
      successStatus?: number;
      source?: 'body' | 'query' | 'params';
    }
  ): Promise<void> {
    try {
      const {
        serviceMethod,
        successMessage,
        successStatus = 200,
        source = 'query'
      } = options;

      const sourceData = source === 'query' ? req.query : 
                        source === 'params' ? req.params : req.body;

      // Extrair parâmetros de paginação
      const paginationData = {
        page: sourceData.page ? parseInt(sourceData.page as string, 10) : undefined,
        limit: sourceData.limit ? parseInt(sourceData.limit as string, 10) : undefined,
        sortBy: sourceData.sortBy as string,
        sortOrder: sourceData.sortOrder as 'ASC' | 'DESC'
      };

      // Validar parâmetros de paginação
      PaginationFactory.validatePaginationParams(paginationData.page, paginationData.limit);

      // Extrair dados de filtro (tudo exceto parâmetros de paginação)
      const filterData = { ...sourceData };
      delete filterData.page;
      delete filterData.limit;
      delete filterData.sortBy;
      delete filterData.sortOrder;

      // Executar método do serviço com paginação e filtros
      const result = await serviceMethod(paginationData, filterData);

      // Se o resultado tem paginação, usar o método apropriado
      if (result && typeof result === 'object' && 'items' in result && 'total' in result) {
        res.status(successStatus).json(
          ResponseBuilder.successWithPagination(
            result.items,
            {
              total: result.total,
              page: result.page,
              limit: result.limit,
              totalPages: result.totalPages,
              hasNext: result.hasNext,
              hasPrev: result.hasPrev,
            },
            successMessage
          )
        );
      } else {
        res.status(successStatus).json(ResponseBuilder.success(result, successMessage));
      }

    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * Validar DTO usando class-validator
   */
  protected async validateDto<T>(data: any, dtoClass: ClassConstructor<T>): Promise<T> {
    const dto = plainToClass(dtoClass, data);
    const errors = await validate(dto as any);

    if (errors.length > 0) {
      const errorMessages = errors.map(error => 
        Object.values(error.constraints || {}).join(', ')
      );
      throw AppError.badRequest(`Dados inválidos: ${errorMessages.join('; ')}`);
    }

    return dto;
  }

  /**
   * Lidar com erros de forma consistente
   */
  protected handleError(res: Response, error: any): void {
    console.error('Erro no Controller:', error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json(ResponseBuilder.error(error.message));
      return;
    }

    // Erros de validação do class-validator
    if (error instanceof Array && error[0] instanceof ValidationError) {
      const errorMessages = error.map((err: ValidationError) => 
        Object.values(err.constraints || {}).join(', ')
      );
      res.status(400).json(ResponseBuilder.validationError(errorMessages));
      return;
    }

    // Erros específicos do banco de dados
    if (error.code === '23505') { // Unique constraint violation
      res.status(409).json(ResponseBuilder.conflict('Registro já existe'));
      return;
    }

    if (error.code === '23503') { // Foreign key constraint violation
      res.status(400).json(ResponseBuilder.error('Referência inválida'));
      return;
    }

    if (error.code === '23502') { // Not null constraint violation
      res.status(400).json(ResponseBuilder.error('Campo obrigatório não informado'));
      return;
    }

    // Erro genérico
    res.status(500).json(ResponseBuilder.error('Erro interno do servidor'));
  }

  /**
   * Extrair informações do usuário autenticado do token
   */
  protected getUserFromRequest(req: Request): any {
    return (req as any).user;
  }

  /**
   * Extrair ID da empresa do usuário autenticado
   */
  protected getCompanyIdFromRequest(req: Request): string {
    const user = this.getUserFromRequest(req);
    return req.params.companyId || user?.currentCompany?.id;
  }

  /**
   * Verificar se o usuário tem uma permissão específica
   */
  protected hasPermission(req: Request, permission: string): boolean {
    const user = this.getUserFromRequest(req);
    return user?.permissions?.includes(permission) || false;
  }

  /**
   * Lançar erro se o usuário não tiver permissão
   */
  protected requirePermission(req: Request, permission: string): void {
    if (!this.hasPermission(req, permission)) {
      throw AppError.forbidden(`Permissão necessária: ${permission}`);
    }
  }
}

