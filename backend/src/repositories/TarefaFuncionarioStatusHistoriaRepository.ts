import { SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@/core/base/BaseRepository';
import { TarefaFuncionarioStatusHistoria } from '@/entities/TarefaFuncionarioStatusHistoria';

export class TarefaFuncionarioStatusHistoriaRepository extends BaseRepository<TarefaFuncionarioStatusHistoria> {
  constructor() {
    super(TarefaFuncionarioStatusHistoria, 'historiaStatusId');
  }

  /**
   * Apply search filters to query builder
   */
  protected applySearch(qb: SelectQueryBuilder<TarefaFuncionarioStatusHistoria>, search: any): void {
    if (search.statusId) {
      qb.andWhere('entity.statusId = :statusId', { statusId: search.statusId });
    }
    
    if (search.statusAnterior) {
      qb.andWhere('entity.statusAnterior ILIKE :statusAnterior', { statusAnterior: `%${search.statusAnterior}%` });
    }
    
    if (search.statusNovo) {
      qb.andWhere('entity.statusNovo ILIKE :statusNovo', { statusNovo: `%${search.statusNovo}%` });
    }
    
  }
}
