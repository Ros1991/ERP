import { BaseService } from '@/core/base/BaseService';
import { TarefaFuncionarioStatus } from '@/entities/TarefaFuncionarioStatus';
import { TarefaFuncionarioStatusRepository } from '@/repositories/TarefaFuncionarioStatusRepository';
import { TarefaFuncionarioStatusMapper } from '@/mappers/TarefaFuncionarioStatusMapper';
import { IDto } from '@/core/base/BaseDto';
import { AppError } from '@/core/errors/AppError';

export class TarefaFuncionarioStatusService extends BaseService<TarefaFuncionarioStatus> {
  private tarefafuncionariostatusRepository: TarefaFuncionarioStatusRepository;

  constructor() {
    const tarefafuncionariostatusRepository = new TarefaFuncionarioStatusRepository();
    const tarefafuncionariostatusMapper = new TarefaFuncionarioStatusMapper();
    super(TarefaFuncionarioStatus, TarefaFuncionarioStatusMapper, 'TarefaFuncionarioStatus');
    this.tarefafuncionariostatusRepository = tarefafuncionariostatusRepository;
    this.baseMapper = tarefafuncionariostatusMapper;
    this.repository = tarefafuncionariostatusRepository;
  }

  /**
   * Validate before creating tarefafuncionariostatus
   */
  protected async validateBeforeCreate(createDto: IDto): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before updating tarefafuncionariostatus
   */
  protected async validateBeforeUpdate(id: number, updateDto: IDto, existingEntity: TarefaFuncionarioStatus): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before deleting tarefafuncionariostatus
   */
  protected async validateBeforeDelete(id: number, entity: TarefaFuncionarioStatus): Promise<void> {
    // Add specific validation logic here
  }
}
