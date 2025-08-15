import { SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@/core/base/BaseRepository';
import { Conta } from '@/entities/Conta';

export class ContaRepository extends BaseRepository<Conta> {
  constructor() {
    super(Conta, 'contaId');
  }

  /**
   * Apply search filters to query builder
   */
  protected applySearch(qb: SelectQueryBuilder<Conta>, search: any): void {
    if (search.empresaId) {
      qb.andWhere('entity.empresaId = :empresaId', { empresaId: search.empresaId });
    }
    
    if (search.nome) {
      qb.andWhere('entity.nome ILIKE :nome', { nome: `%${search.nome}%` });
    }
    
    if (search.tipo) {
      qb.andWhere('entity.tipo ILIKE :tipo', { tipo: `%${search.tipo}%` });
    }
    
    if (search.ativa) {
      qb.andWhere('entity.ativa ILIKE :ativa', { ativa: `%${search.ativa}%` });
    }
    
    if (search.isDeleted !== undefined) {
      qb.andWhere('entity.isDeleted = :isDeleted', { isDeleted: search.isDeleted });
    }

  }
}
