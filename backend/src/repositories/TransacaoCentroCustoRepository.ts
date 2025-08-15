import { SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@/core/base/BaseRepository';
import { TransacaoCentroCusto } from '@/entities/TransacaoCentroCusto';

export class TransacaoCentroCustoRepository extends BaseRepository<TransacaoCentroCusto> {
  constructor() {
    super(TransacaoCentroCusto, 'transacaoCentroCustoId');
  }

  /**
   * Apply search filters to query builder
   */
  protected applySearch(qb: SelectQueryBuilder<TransacaoCentroCusto>, search: any): void {
    if (search.transacaoId) {
      qb.andWhere('entity.transacaoId = :transacaoId', { transacaoId: search.transacaoId });
    }
    
    if (search.centroCustoId) {
      qb.andWhere('entity.centroCustoId = :centroCustoId', { centroCustoId: search.centroCustoId });
    }
    
  }
}
