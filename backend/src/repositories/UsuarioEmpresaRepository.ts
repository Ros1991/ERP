import { SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@/core/base/BaseRepository';
import { UsuarioEmpresa } from '@/entities/UsuarioEmpresa';

export class UsuarioEmpresaRepository extends BaseRepository<UsuarioEmpresa> {
  constructor() {
    super(UsuarioEmpresa, 'usuarioEmpresaId');
  }

  /**
   * Apply search filters to query builder
   */
  protected applySearch(qb: SelectQueryBuilder<UsuarioEmpresa>, search: any): void {
    if (search.userId) {
      qb.andWhere('entity.userId = :userId', { userId: search.userId });
    }
    
    if (search.empresaId) {
      qb.andWhere('entity.empresaId = :empresaId', { empresaId: search.empresaId });
    }
    
    if (search.roleId) {
      qb.andWhere('entity.roleId = :roleId', { roleId: search.roleId });
    }
    
    if (search.ativo !== undefined) {
      qb.andWhere('entity.ativo = :ativo', { ativo: search.ativo });
    }

  }
}
