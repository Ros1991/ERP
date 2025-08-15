import { BaseService } from '@/core/base/BaseService';
import { TarefaHistoria } from '@/entities/TarefaHistoria';
import { TarefaHistoriaRepository } from '@/repositories/TarefaHistoriaRepository';
import { TarefaHistoriaMapper } from '@/mappers/TarefaHistoriaMapper';
import { IDto } from '@/core/base/BaseDto';
import { AppError } from '@/core/errors/AppError';

export class TarefaHistoriaService extends BaseService<TarefaHistoria> {
  private tarefahistoriaRepository: TarefaHistoriaRepository;

  constructor() {
    const tarefahistoriaRepository = new TarefaHistoriaRepository();
    const tarefahistoriaMapper = new TarefaHistoriaMapper();
    super(TarefaHistoria, TarefaHistoriaMapper, 'TarefaHistoria');
    this.tarefahistoriaRepository = tarefahistoriaRepository;
    this.baseMapper = tarefahistoriaMapper;
    this.repository = tarefahistoriaRepository;
  }

  /**
   * Validate before creating tarefahistoria
   */
  protected async validateBeforeCreate(createDto: IDto): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before updating tarefahistoria
   */
  protected async validateBeforeUpdate(id: number, updateDto: IDto, existingEntity: TarefaHistoria): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before deleting tarefahistoria
   */
  protected async validateBeforeDelete(id: number, entity: TarefaHistoria): Promise<void> {
    // Add specific validation logic here
  }
}
