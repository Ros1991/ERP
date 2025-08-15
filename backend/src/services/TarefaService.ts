import { BaseService } from '@/core/base/BaseService';
import { Tarefa } from '@/entities/Tarefa';
import { TarefaRepository } from '@/repositories/TarefaRepository';
import { TarefaMapper } from '@/mappers/TarefaMapper';
import { IDto } from '@/core/base/BaseDto';
import { AppError } from '@/core/errors/AppError';

export class TarefaService extends BaseService<Tarefa> {
  private tarefaRepository: TarefaRepository;

  constructor() {
    const tarefaRepository = new TarefaRepository();
    const tarefaMapper = new TarefaMapper();
    super(Tarefa, TarefaMapper, 'Tarefa');
    this.tarefaRepository = tarefaRepository;
    this.baseMapper = tarefaMapper;
    this.repository = tarefaRepository;
  }

  /**
   * Validate before creating tarefa
   */
  protected async validateBeforeCreate(createDto: IDto): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before updating tarefa
   */
  protected async validateBeforeUpdate(id: number, updateDto: IDto, existingEntity: Tarefa): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before deleting tarefa
   */
  protected async validateBeforeDelete(id: number, entity: Tarefa): Promise<void> {
    // Add specific validation logic here
  }
}
