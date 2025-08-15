import { BaseRepository } from '../repositories/BaseRepository';
import { PaginatedResult, PaginationOptions } from '../utils/PaginationFactory';
import { AppError } from '../utils/AppError';
import { FindManyOptions, FindOptionsWhere, DeepPartial, ObjectLiteral } from 'typeorm';

export abstract class BaseService<T extends ObjectLiteral, CreateDto, UpdateDto> {
  protected repository: BaseRepository<T>;

  constructor(repository: BaseRepository<T>) {
    this.repository = repository;
  }

  async findById(id: string | number): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw AppError.notFound('Registro não encontrado');
    }
    return entity;
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.findAll(options);
  }

  async findPaginated(
    paginationOptions: PaginationOptions,
    findOptions?: FindManyOptions<T>
  ): Promise<PaginatedResult<T>> {
    return await this.repository.findPaginated(paginationOptions, findOptions);
  }

  async create(data: CreateDto): Promise<T> {
    try {
      await this.validateCreate(data);
      const entityData = await this.transformCreateData(data);
      const entity = await this.repository.create(entityData);
      await this.afterCreate(entity, data);
      return entity;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw AppError.badRequest(`Erro ao criar registro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async update(id: string | number, data: UpdateDto): Promise<T> {
    try {
      const existingEntity = await this.findById(id);
      await this.validateUpdate(id, data, existingEntity);
      const entityData = await this.transformUpdateData(data, existingEntity);
      const updatedEntity = await this.repository.update(id, entityData);
      
      if (!updatedEntity) {
        throw AppError.notFound('Registro não encontrado após atualização');
      }
      
      await this.afterUpdate(updatedEntity, data, existingEntity);
      return updatedEntity;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw AppError.badRequest(`Erro ao atualizar registro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async delete(id: string | number): Promise<void> {
    try {
      const existingEntity = await this.findById(id);
      await this.validateDelete(id, existingEntity);
      
      const deleted = await this.repository.delete(id);
      if (!deleted) {
        throw AppError.notFound('Registro não encontrado para exclusão');
      }
      
      await this.afterDelete(existingEntity);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw AppError.badRequest(`Erro ao excluir registro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async exists(where: FindOptionsWhere<T>): Promise<boolean> {
    return await this.repository.exists(where);
  }

  async count(where?: FindOptionsWhere<T>): Promise<number> {
    return await this.repository.count(where);
  }

  async findOne(where: FindOptionsWhere<T>, options?: FindManyOptions<T>): Promise<T | null> {
    return await this.repository.findOne(where, options);
  }

  async findMany(where: FindOptionsWhere<T>, options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.findMany(where, options);
  }

  async findWithRelations(id: string | number, relations: string[]): Promise<T> {
    const entity = await this.repository.findWithRelations(id, relations);
    if (!entity) {
      throw AppError.notFound('Registro não encontrado');
    }
    return entity;
  }

  // Métodos de hook que podem ser sobrescritos pelas classes filhas
  protected async validateCreate(data: CreateDto): Promise<void> {
    // Implementação padrão vazia - pode ser sobrescrita
  }

  protected async validateUpdate(id: string | number, data: UpdateDto, existingEntity: T): Promise<void> {
    // Implementação padrão vazia - pode ser sobrescrita
  }

  protected async validateDelete(id: string | number, existingEntity: T): Promise<void> {
    // Implementação padrão vazia - pode ser sobrescrita
  }

  protected async transformCreateData(data: CreateDto): Promise<DeepPartial<T>> {
    // Implementação padrão - retorna os dados como estão
    return data as unknown as DeepPartial<T>;
  }

  protected async transformUpdateData(data: UpdateDto, existingEntity: T): Promise<DeepPartial<T>> {
    // Implementação padrão - retorna os dados como estão
    return data as unknown as DeepPartial<T>;
  }

  protected async afterCreate(entity: T, originalData: CreateDto): Promise<void> {
    // Implementação padrão vazia - pode ser sobrescrita
  }

  protected async afterUpdate(entity: T, originalData: UpdateDto, previousEntity: T): Promise<void> {
    // Implementação padrão vazia - pode ser sobrescrita
  }

  protected async afterDelete(deletedEntity: T): Promise<void> {
    // Implementação padrão vazia - pode ser sobrescrita
  }

  // Métodos utilitários
  protected throwIfNotFound(entity: T | null, message: string = 'Registro não encontrado'): T {
    if (!entity) {
      throw AppError.notFound(message);
    }
    return entity;
  }

  protected throwIfExists(exists: boolean, message: string = 'Registro já existe'): void {
    if (exists) {
      throw AppError.conflict(message);
    }
  }

  protected validateRequiredFields(data: any, fields: string[]): void {
    const missingFields = fields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      throw AppError.badRequest(`Campos obrigatórios não informados: ${missingFields.join(', ')}`);
    }
  }

  protected async executeInTransaction<R>(fn: () => Promise<R>): Promise<R> {
    return await this.repository.transaction(async () => {
      return await fn();
    });
  }
}

