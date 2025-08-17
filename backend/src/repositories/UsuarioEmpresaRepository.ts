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

  /**
   * Find UsuarioEmpresa by ID with empresa and role relations
   */
  async findByIdWithRelations(id: number): Promise<UsuarioEmpresa | null> {
    return await this.repository
      .createQueryBuilder('usuarioEmpresa')
      .innerJoinAndSelect('usuarioEmpresa.empresa', 'empresa')
      .innerJoinAndSelect('usuarioEmpresa.role', 'role')
      .where('usuarioEmpresa.usuarioEmpresaId = :id', { id })
      .andWhere('(empresa.isDeleted IS NULL OR empresa.isDeleted = false)')
      .getOne();
  }

  /**
   * Find UsuarioEmpresa by userId with empresa and role relations
   */
  async findByUserIdWithRelations(userId: number): Promise<UsuarioEmpresa[]> {
    return await this.repository
      .createQueryBuilder('usuarioEmpresa')
      .innerJoinAndSelect('usuarioEmpresa.empresa', 'empresa')
      .innerJoinAndSelect('usuarioEmpresa.role', 'role')
      .where('usuarioEmpresa.userId = :userId', { userId })
      .andWhere('usuarioEmpresa.ativo = true')
      .andWhere('(empresa.isDeleted IS NULL OR empresa.isDeleted = false)')
      .orderBy('empresa.nome', 'ASC')
      .getMany();
  }

  /**
   * Verify if user has permission to access a specific empresa
   * Used by middleware for permission checking
   */
  async verifyUserEmpresaPermission(userId: number, empresaId: number): Promise<boolean> {
    const usuarioEmpresa = await this.repository
      .createQueryBuilder('ue')
      .innerJoinAndSelect('ue.empresa', 'empresa')
      .where('ue.userId = :userId', { userId })
      .andWhere('ue.empresaId = :empresaId', { empresaId })
      .andWhere('ue.ativo = :ativo', { ativo: true })
      .andWhere('empresa.isDeleted = :isDeleted', { isDeleted: false })
      .getOne();

    return !!usuarioEmpresa;
  }
}
