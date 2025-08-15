import { SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@/core/base/BaseRepository';
import { TarefaHistoria } from '@/entities/TarefaHistoria';

export class TarefaHistoriaRepository extends BaseRepository<TarefaHistoria> {
  constructor() {
    super(TarefaHistoria, 'historiaId');
  }

  /**
   * Apply search filters to query builder
   */
  protected applySearch(qb: SelectQueryBuilder<TarefaHistoria>, search: any): void {
    if (search.tarefaId) {
      qb.andWhere('entity.tarefaId = :tarefaId', { tarefaId: search.tarefaId });
    }
    
    if (search.usuarioEmpresaId) {
      qb.andWhere('entity.usuarioEmpresaId = :usuarioEmpresaId', { usuarioEmpresaId: search.usuarioEmpresaId });
    }
    
    if (search.tipoEvento) {
      qb.andWhere('entity.tipoEvento ILIKE :tipoEvento', { tipoEvento: `%${search.tipoEvento}%` });
    }
    
  }
}
