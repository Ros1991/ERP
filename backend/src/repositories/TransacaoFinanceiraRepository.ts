import { SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@/core/base/BaseRepository';
import { TransacaoFinanceira } from '@/entities/TransacaoFinanceira';

export class TransacaoFinanceiraRepository extends BaseRepository<TransacaoFinanceira> {
  constructor() {
    super(TransacaoFinanceira, 'transacaoId');
  }

  /**
   * Apply search filters to query builder
   */
  protected applySearch(qb: SelectQueryBuilder<TransacaoFinanceira>, search: any): void {
    if (search.empresaId) {
      qb.andWhere('entity.empresaId = :empresaId', { empresaId: search.empresaId });
    }
    
    if (search.tipo) {
      qb.andWhere('entity.tipo ILIKE :tipo', { tipo: `%${search.tipo}%` });
    }
    
    if (search.contaId) {
      qb.andWhere('entity.contaId = :contaId', { contaId: search.contaId });
    }
    
    if (search.terceiroId) {
      qb.andWhere('entity.terceiroId = :terceiroId', { terceiroId: search.terceiroId });
    }
    
    if (search.status) {
      qb.andWhere('entity.status ILIKE :status', { status: `%${search.status}%` });
    }
    
    if (search.isDeleted !== undefined) {
      qb.andWhere('entity.isDeleted = :isDeleted', { isDeleted: search.isDeleted });
    }

  }
}
