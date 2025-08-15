import { SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@/core/base/BaseRepository';
import { FuncionarioBeneficioDesconto } from '@/entities/FuncionarioBeneficioDesconto';

export class FuncionarioBeneficioDescontoRepository extends BaseRepository<FuncionarioBeneficioDesconto> {
  constructor() {
    super(FuncionarioBeneficioDesconto, 'beneficioDescontoId');
  }

  /**
   * Apply search filters to query builder
   */
  protected applySearch(qb: SelectQueryBuilder<FuncionarioBeneficioDesconto>, search: any): void {
    if (search.contratoId) {
      qb.andWhere('entity.contratoId = :contratoId', { contratoId: search.contratoId });
    }
    
    if (search.tipo) {
      qb.andWhere('entity.tipo ILIKE :tipo', { tipo: `%${search.tipo}%` });
    }
    
    if (search.nome) {
      qb.andWhere('entity.nome ILIKE :nome', { nome: `%${search.nome}%` });
    }
    
    if (search.frequencia) {
      qb.andWhere('entity.frequencia ILIKE :frequencia', { frequencia: `%${search.frequencia}%` });
    }
    
    if (search.ativo !== undefined) {
      qb.andWhere('entity.ativo = :ativo', { ativo: search.ativo });
    }

  }
}
