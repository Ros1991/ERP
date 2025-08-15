import { BaseService } from '@/core/base/BaseService';
import { TarefaTipo } from '@/entities/TarefaTipo';
import { TarefaTipoRepository } from '@/repositories/TarefaTipoRepository';
import { TarefaTipoMapper } from '@/mappers/TarefaTipoMapper';
import { IDto } from '@/core/base/BaseDto';
import { AppError } from '@/core/errors/AppError';

export class TarefaTipoService extends BaseService<TarefaTipo> {
  private tarefatipoRepository: TarefaTipoRepository;

  constructor() {
    const tarefatipoRepository = new TarefaTipoRepository();
    const tarefatipoMapper = new TarefaTipoMapper();
    super(TarefaTipo, TarefaTipoMapper, 'TarefaTipo');
    this.tarefatipoRepository = tarefatipoRepository;
    this.baseMapper = tarefatipoMapper;
    this.repository = tarefatipoRepository;
  }

  /**
   * Validate before creating tarefatipo
   */
  protected async validateBeforeCreate(createDto: IDto): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before updating tarefatipo
   */
  protected async validateBeforeUpdate(id: number, updateDto: IDto, existingEntity: TarefaTipo): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before deleting tarefatipo
   */
  protected async validateBeforeDelete(id: number, entity: TarefaTipo): Promise<void> {
    // Add specific validation logic here
  }
}
