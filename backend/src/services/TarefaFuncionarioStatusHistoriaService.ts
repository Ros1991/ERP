import { BaseService } from '@/core/base/BaseService';
import { TarefaFuncionarioStatusHistoria } from '@/entities/TarefaFuncionarioStatusHistoria';
import { TarefaFuncionarioStatusHistoriaRepository } from '@/repositories/TarefaFuncionarioStatusHistoriaRepository';
import { TarefaFuncionarioStatusHistoriaMapper } from '@/mappers/TarefaFuncionarioStatusHistoriaMapper';
import { IDto } from '@/core/base/BaseDto';
import { AppError } from '@/core/errors/AppError';

export class TarefaFuncionarioStatusHistoriaService extends BaseService<TarefaFuncionarioStatusHistoria> {
  private tarefafuncionariostatushistoriaRepository: TarefaFuncionarioStatusHistoriaRepository;

  constructor() {
    const tarefafuncionariostatushistoriaRepository = new TarefaFuncionarioStatusHistoriaRepository();
    const tarefafuncionariostatushistoriaMapper = new TarefaFuncionarioStatusHistoriaMapper();
    super(TarefaFuncionarioStatusHistoria, TarefaFuncionarioStatusHistoriaMapper, 'TarefaFuncionarioStatusHistoria');
    this.tarefafuncionariostatushistoriaRepository = tarefafuncionariostatushistoriaRepository;
    this.baseMapper = tarefafuncionariostatushistoriaMapper;
    this.repository = tarefafuncionariostatushistoriaRepository;
  }

  /**
   * Validate before creating tarefafuncionariostatushistoria
   */
  protected async validateBeforeCreate(createDto: IDto): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before updating tarefafuncionariostatushistoria
   */
  protected async validateBeforeUpdate(id: number, updateDto: IDto, existingEntity: TarefaFuncionarioStatusHistoria): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before deleting tarefafuncionariostatushistoria
   */
  protected async validateBeforeDelete(id: number, entity: TarefaFuncionarioStatusHistoria): Promise<void> {
    // Add specific validation logic here
  }
}
