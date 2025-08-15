import { Repository, FindOptionsWhere, FindManyOptions, DeepPartial, ObjectLiteral, EntityTarget, Not } from 'typeorm';
import { AppDataSource } from '@/config/database';
import { PaginationFactory, PaginatedResult, PaginationOptions } from '@/utils/PaginationFactory';

export abstract class BaseRepository<T extends ObjectLiteral> {
  protected repository: Repository<T>;
  private entity: EntityTarget<T>;

  constructor(entity: EntityTarget<T>) {
    this.entity = entity;
  }

  protected getRepository(): Repository<T> {
    if (!this.repository) {
      if (!AppDataSource.isInitialized) {
        throw new Error('Conexão com banco de dados não inicializada. Certifique-se de que o AppDataSource foi inicializado antes de usar os repositórios.');
      }
      this.repository = AppDataSource.getRepository(this.entity);
    }
    return this.repository;
  }

  async findById(id: string | number): Promise<T | null> {
    return await this.getRepository().findOne({ 
      where: { id } as unknown as FindOptionsWhere<T> 
    });
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.getRepository().find(options);
  }

  async findPaginated(
    paginationOptions: PaginationOptions,
    findOptions?: FindManyOptions<T>
  ): Promise<PaginatedResult<T>> {
    const { page, limit, sortBy, sortOrder } = PaginationFactory.createOptions(paginationOptions);
    const skip = PaginationFactory.getSkip(page, limit);

    const [items, total] = await this.getRepository().findAndCount({
      ...findOptions,
      skip,
      take: limit,
      order: {
        [sortBy]: sortOrder,
      } as any,
    });

    return PaginationFactory.createResult(items, total, page, limit);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.getRepository().create(data);
    return await this.getRepository().save(entity);
  }

  async update(id: string | number, data: DeepPartial<T>): Promise<T | null> {
    await this.getRepository().update(id, data as any);
    return await this.findById(id);
  }

  async delete(id: string | number): Promise<boolean> {
    const result = await this.getRepository().delete(id);
    return (result.affected ?? 0) > 0;
  }

  async exists(where: FindOptionsWhere<T>): Promise<boolean> {
    const count = await this.getRepository().count({ where });
    return count > 0;
  }

  async count(where?: FindOptionsWhere<T>): Promise<number> {
    return await this.getRepository().count({ where });
  }

  async findOne(where: FindOptionsWhere<T>, options?: FindManyOptions<T>): Promise<T | null> {
    return await this.getRepository().findOne({
      where,
      ...options,
    });
  }

  async findMany(where: FindOptionsWhere<T>, options?: FindManyOptions<T>): Promise<T[]> {
    return await this.getRepository().find({
      where,
      ...options,
    });
  }

  async createMany(data: DeepPartial<T>[]): Promise<T[]> {
    const entities = this.getRepository().create(data);
    return await this.getRepository().save(entities);
  }

  async updateMany(where: FindOptionsWhere<T>, data: DeepPartial<T>): Promise<void> {
    await this.getRepository().update(where, data as any);
  }

  async deleteMany(where: FindOptionsWhere<T>): Promise<number> {
    const result = await this.getRepository().delete(where);
    return result.affected ?? 0;
  }

  async softDelete(id: string | number): Promise<boolean> {
    const result = await this.getRepository().softDelete(id);
    return (result.affected ?? 0) > 0;
  }

  async restore(id: string | number): Promise<boolean> {
    const result = await this.getRepository().restore(id);
    return (result.affected ?? 0) > 0;
  }

  async findWithRelations(id: string | number, relations: string[]): Promise<T | null> {
    return await this.getRepository().findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
      relations,
    });
  }

  async findManyWithRelations(where: FindOptionsWhere<T>, relations: string[]): Promise<T[]> {
    return await this.getRepository().find({
      where,
      relations,
    });
  }

  async executeRawQuery(query: string, parameters?: any[]): Promise<any> {
    return await this.getRepository().query(query, parameters);
  }

  async transaction<R>(fn: (repository: Repository<T>) => Promise<R>): Promise<R> {
    return await AppDataSource.transaction(async (manager) => {
      const transactionalRepository = manager.getRepository(this.entity);
      return await fn(transactionalRepository);
    });
  }
}

