import { SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@/core/base/BaseRepository';
import { TarefaFuncionarioStatus } from '@/entities/TarefaFuncionarioStatus';

export class TarefaFuncionarioStatusRepository extends BaseRepository<TarefaFuncionarioStatus> {
  constructor() {
    super(TarefaFuncionarioStatus, 'statusId');
  }

  /**
   * Apply search filters to query builder
   */
  protected applySearch(qb: SelectQueryBuilder<TarefaFuncionarioStatus>, search: any): void {
    if (search.tarefaId) {
      qb.andWhere('entity.tarefaId = :tarefaId', { tarefaId: search.tarefaId });
    }
    
    if (search.funcionarioId) {
      qb.andWhere('entity.funcionarioId = :funcionarioId', { funcionarioId: search.funcionarioId });
    }
    
    if (search.status) {
      qb.andWhere('entity.status ILIKE :status', { status: `%${search.status}%` });
    }
    
  }
}
