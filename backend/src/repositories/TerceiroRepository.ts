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
    
    if (search.search) {
      qb.andWhere('(' +
        'entity.nome ILIKE :searchTerm OR ' +
        'entity.cnpjCpf ILIKE :searchTerm OR ' +
        'entity.endereco ILIKE :searchTerm OR ' +
        'entity.telefone ILIKE :searchTerm OR ' +
        'entity.email ILIKE :searchTerm' +
      ')', { searchTerm: `%${search.search}%` });
    }
  }
}
