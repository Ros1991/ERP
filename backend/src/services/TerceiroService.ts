import { BaseService } from '@/core/base/BaseService';
import { Terceiro } from '@/entities/Terceiro';
import { TerceiroRepository } from '@/repositories/TerceiroRepository';
import { TerceiroMapper } from '@/mappers/TerceiroMapper';
import { IDto } from '@/core/base/BaseDto';
import { AppError } from '@/core/errors/AppError';

export class TerceiroService extends BaseService<Terceiro> {
  private terceiroRepository: TerceiroRepository;

  constructor() {
    const terceiroRepository = new TerceiroRepository();
    const terceiroMapper = new TerceiroMapper();
    super(Terceiro, TerceiroMapper, 'Terceiro');
    this.terceiroRepository = terceiroRepository;
    this.baseMapper = terceiroMapper;
    this.repository = terceiroRepository;
  }

  /**
   * Validate before creating terceiro
   */
  protected async validateBeforeCreate(createDto: IDto): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before updating terceiro
   */
  protected async validateBeforeUpdate(id: number, updateDto: IDto, existingEntity: Terceiro): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before deleting terceiro
   */
  protected async validateBeforeDelete(id: number, entity: Terceiro): Promise<void> {
    // Add specific validation logic here
  }
}
