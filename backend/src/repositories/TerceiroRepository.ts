import { SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@/core/base/BaseRepository';
import { Terceiro } from '@/entities/Terceiro';

export class TerceiroRepository extends BaseRepository<Terceiro> {
  constructor() {
    super(Terceiro, 'terceiroId');
  }

  /**
   * Apply search filters to query builder
   */
  protected applySearch(qb: SelectQueryBuilder<Terceiro>, search: any): void {
    if (search.empresaId) {
      qb.andWhere('entity.empresaId = :empresaId', { empresaId: search.empresaId });
    }
    
    if (search.nome) {
      qb.andWhere('entity.nome ILIKE :nome', { nome: `%${search.nome}%` });
    }
    
    if (search.tipo) {
      qb.andWhere('entity.tipo ILIKE :tipo', { tipo: `%${search.tipo}%` });
    }
    
    if (search.cnpjCpf) {
      qb.andWhere('entity.cnpjCpf ILIKE :cnpjCpf', { cnpjCpf: `%${search.cnpjCpf}%` });
    }
    
    if (search.ativo !== undefined) {
      qb.andWhere('entity.ativo = :ativo', { ativo: search.ativo });
    }

    if (search.isDeleted !== undefined) {
      qb.andWhere('entity.isDeleted = :isDeleted', { isDeleted: search.isDeleted });
    }

  }
}
