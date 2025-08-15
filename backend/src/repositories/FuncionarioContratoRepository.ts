import { SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@/core/base/BaseRepository';
import { FuncionarioContrato } from '@/entities/FuncionarioContrato';

export class FuncionarioContratoRepository extends BaseRepository<FuncionarioContrato> {
  constructor() {
    super(FuncionarioContrato, 'contratoId');
  }

  /**
   * Apply search filters to query builder
   */
  protected applySearch(qb: SelectQueryBuilder<FuncionarioContrato>, search: any): void {
    if (search.funcionarioId) {
      qb.andWhere('entity.funcionarioId = :funcionarioId', { funcionarioId: search.funcionarioId });
    }
    
    if (search.tipoContrato) {
      qb.andWhere('entity.tipoContrato ILIKE :tipoContrato', { tipoContrato: `%${search.tipoContrato}%` });
    }
    
    if (search.tipoPagamento) {
      qb.andWhere('entity.tipoPagamento ILIKE :tipoPagamento', { tipoPagamento: `%${search.tipoPagamento}%` });
    }
    
    if (search.ativo !== undefined) {
      qb.andWhere('entity.ativo = :ativo', { ativo: search.ativo });
    }

    if (search.isDeleted !== undefined) {
      qb.andWhere('entity.isDeleted = :isDeleted', { isDeleted: search.isDeleted });
    }

  }
}
