import { SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@/core/base/BaseRepository';
import { Emprestimo } from '@/entities/Emprestimo';

export class EmprestimoRepository extends BaseRepository<Emprestimo> {
  constructor() {
    super(Emprestimo, 'emprestimoId');
  }

  /**
   * Apply search filters to query builder
   */
  protected applySearch(qb: SelectQueryBuilder<Emprestimo>, search: any): void {
    if (search.empresaId) {
      qb.andWhere('entity.empresaId = :empresaId', { empresaId: search.empresaId });
    }
    
    if (search.funcionarioId) {
      qb.andWhere('entity.funcionarioId = :funcionarioId', { funcionarioId: search.funcionarioId });
    }
    
    if (search.status) {
      qb.andWhere('entity.status ILIKE :status', { status: `%${search.status}%` });
    }
    
  }
}
