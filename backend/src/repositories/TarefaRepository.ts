import { SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@/core/base/BaseRepository';
import { Tarefa } from '@/entities/Tarefa';

export class TarefaRepository extends BaseRepository<Tarefa> {
  constructor() {
    super(Tarefa, 'tarefaId');
  }

  /**
   * Apply search filters to query builder
   */
  protected applySearch(qb: SelectQueryBuilder<Tarefa>, search: any): void {
    if (search.empresaId) {
      qb.andWhere('entity.empresaId = :empresaId', { empresaId: search.empresaId });
    }
    
    if (search.tipoId) {
      qb.andWhere('entity.tipoId = :tipoId', { tipoId: search.tipoId });
    }
    
    if (search.titulo) {
      qb.andWhere('entity.titulo ILIKE :titulo', { titulo: `%${search.titulo}%` });
    }
    
    if (search.status) {
      qb.andWhere('entity.status ILIKE :status', { status: `%${search.status}%` });
    }
    
    if (search.prioridade) {
      qb.andWhere('entity.prioridade ILIKE :prioridade', { prioridade: `%${search.prioridade}%` });
    }
    
    if (search.isDeleted !== undefined) {
      qb.andWhere('entity.isDeleted = :isDeleted', { isDeleted: search.isDeleted });
    }

  }
}
