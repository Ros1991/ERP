import { Request, Response } from 'express';
import { BaseService } from './BaseService';
import { ObjectLiteral } from 'typeorm';
import { BaseMapper } from './BaseMapper';

export class BaseController<Entity extends ObjectLiteral> {
  
  service: BaseService<Entity>;
  private EntityClass?: new () => Entity;

  constructor(
    EntityClass?: new () => Entity,
    MapperClass?: new () => BaseMapper<Entity>) {
    this.service = new BaseService<Entity>(EntityClass, MapperClass);
    this.EntityClass = EntityClass;
  }

  /**
   * Check if entity has empresaId field using TypeORM metadata
   */
  protected hasEmpresaIdField(): boolean {
    if (!this.EntityClass) {
      console.log('No EntityClass provided');
      return false;
    }
    
    try {
      const { AppDataSource } = require('../../config/database');
      if (!AppDataSource.isInitialized) {
        return false;
      }
      const repository = AppDataSource.getRepository(this.EntityClass);
      const metadata = repository.metadata;
      const hasEmpresaId = metadata.columns.some((column: any) => 
        column.propertyName === 'empresaId' || column.databaseName === 'empresa_id'
      );
      return hasEmpresaId;
    } catch (error) {
      console.error('Error checking empresaId field:', error);
      return false;
    }
  }

  /**
   * List with pagination and filters, automatically filtering by empresaId when available
   */
  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const sourceData = req.query;
      const filterData = { ...sourceData };
      delete filterData.page;
      delete filterData.limit;
      delete filterData.sortBy;
      delete filterData.sortOrder;

      if ((req as any).empresaId && this.hasEmpresaIdField()) {
        filterData.empresaId = (req as any).empresaId;
      }

      const paginationData = {
        page: sourceData.page ? parseInt(sourceData.page as string, 10) : undefined,
        limit: sourceData.limit ? parseInt(sourceData.limit as string, 10) : undefined,
        sortBy: sourceData.sortBy as string,
        sortOrder: sourceData.sortOrder as 'ASC' | 'DESC',
        search: filterData,
      };
      
      // Execute service method with pagination and filters
      const result = await this.service.findWithPagination(paginationData);
      res.status(200).json({
        success: true,
        message: 'Listagem realizada com sucesso',
        data: result,
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Get entity by ID with empresa validation when applicable
   */
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params['id'] as string, 10);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido',
        });
        return;
      }

      // For entities with empresaId, validate access through service method
      if ((req as any).empresaId && this.hasEmpresaIdField()) {
        const result = await this.service.findByIdWithEmpresa(id, (req as any).empresaId);
        res.status(200).json({
          success: true,
          message: 'Obtido com sucesso',
          data: result,
        });
      } else {
        const result = await this.service.findById(id);
        res.status(200).json({
          success: true,
          message: 'Obtido com sucesso',
          data: result,
        });
      }

    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Create new entity with empresaId validation when applicable
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const sourceData = req.body;
      
      // Add empresaId if available and entity supports it
      if ((req as any).empresaId && this.hasEmpresaIdField()) {
        sourceData.empresaId = (req as any).empresaId;
      }
      
      const result = await this.service.create(sourceData);

      // Send success response
      res.status(201).json({
        success: true,
        message: 'Criado com sucesso',
        data: result,
      });

    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Update entity with empresaId validation when applicable
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params['id'] as string, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido',
        });
        return;
      }

      // For entities with empresaId, validate access before update
      if ((req as any).empresaId && this.hasEmpresaIdField()) {
        const result = await this.service.updateWithEmpresa(id, req.body, (req as any).empresaId);
        res.status(200).json({
          success: true,
          message: 'Atualizado com sucesso',
          data: result,
        });
      } else {
        const result = await this.service.update(id, req.body);
        res.status(200).json({
          success: true,
          message: 'Atualizado com sucesso',
          data: result,
        });
      }

    } catch (error) {
      this.handleError(res, error);
    }
  };

  /**
   * Delete entity with empresaId validation when applicable
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params['id'] as string, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID inválido',
        });
        return;
      }

      // For entities with empresaId, validate access before delete
      if ((req as any).empresaId && this.hasEmpresaIdField()) {
        await this.service.deleteWithEmpresa(id, (req as any).empresaId);
      } else {
        await this.service.delete(id);
      }
      
      res.status(200).json({
        success: true,
        message: 'Excluído com sucesso',
        data: null,
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  protected handleError(res: Response, error: any): void {
    console.error('Controller Error:', error);

    if (error.message?.includes('not found') || error.message?.includes('não encontrado')) {
      res.status(404).json({
        success: false,
        message: error.message || 'Recurso não encontrado',
      });
    } else if (error.message?.includes('already exists') || error.message?.includes('já existe')) {
      res.status(409).json({
        success: false,
        message: error.message || 'Recurso já existe',
      });
    } else if (error.message?.includes('validation') || error.message?.includes('validação')) {
      res.status(400).json({
        success: false,
        message: error.message || 'Dados inválidos',
      });
    } else if (error.message?.includes('Email ou senha incorretos')) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    } else if (
      error.message?.includes('Senha atual incorreta') ||
      error.message?.includes('Usuário não possui senha definida')
    ) {
      // Erros de validação de senha atual - 400 Bad Request (não é problema de autenticação)
      res.status(400).json({
        success: false,
        message: error.message,
      });
    } else if (
      error.message?.includes('Senha deve conter') ||
      error.message?.includes('Senha muito comum') ||
      error.message?.includes('Nova senha deve ter') ||
      error.message?.includes('senha deve ter pelo menos')
    ) {
      // Erros de validação de nova senha - 400 Bad Request
      res.status(400).json({
        success: false,
        message: error.message,
      });
    } else if (error.message?.includes('já foi registrada')) {
      // Erro de chegada/presença já registrada - 400 Bad Request
      res.status(400).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }
}
