import { SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@/core/base/BaseRepository';
import { CentroCusto } from '@/entities/CentroCusto';

export class CentroCustoRepository extends BaseRepository<CentroCusto> {
  constructor() {
    super(CentroCusto, 'centroCustoId');
  }

  /**
   * Apply search filters to query builder
   */
  protected applySearch(qb: SelectQueryBuilder<CentroCusto>, search: any): void {
    if (search.empresaId) {
      qb.andWhere('entity.empresaId = :empresaId', { empresaId: search.empresaId });
    }
    
    if (search.nome) {
      qb.andWhere('entity.nome ILIKE :nome', { nome: `%${search.nome}%` });
    }
    
    if (search.ativo !== undefined) {
      qb.andWhere('entity.ativo = :ativo', { ativo: search.ativo });
    }

    if (search.isDeleted !== undefined) {
      qb.andWhere('entity.isDeleted = :isDeleted', { isDeleted: search.isDeleted });
    }

  }
}
