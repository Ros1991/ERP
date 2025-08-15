import { SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@/core/base/BaseRepository';
import { Empresa } from '@/entities/Empresa';

export class EmpresaRepository extends BaseRepository<Empresa> {
  constructor() {
    super(Empresa, 'empresaId');
  }

  /**
   * Apply search filters to query builder
   */
  protected applySearch(qb: SelectQueryBuilder<Empresa>, search: any): void {
    if (search.nome) {
      qb.andWhere('entity.nome ILIKE :nome', { nome: `%${search.nome}%` });
    }
    
    if (search.cnpj) {
      qb.andWhere('entity.cnpj ILIKE :cnpj', { cnpj: `%${search.cnpj}%` });
    }

    if (search.razaoSocial) {
      qb.andWhere('entity.razaoSocial ILIKE :razaoSocial', { razaoSocial: `%${search.razaoSocial}%` });
    }

    if (search.ativa !== undefined) {
      qb.andWhere('entity.ativa = :ativa', { ativa: search.ativa });
    }

    if (search.isDeleted !== undefined) {
      qb.andWhere('entity.isDeleted = :isDeleted', { isDeleted: search.isDeleted });
    }
  }

  /**
   * Find empresa by CNPJ
   */
  async findByCnpj(cnpj: string): Promise<Empresa | null> {
    return await this.repository.findOne({
      where: { cnpj, isDeleted: false }
    });
  }

  /**
   * Check if CNPJ exists (excluding current empresa)
   */
  async cnpjExists(cnpj: string, excludeEmpresaId?: number): Promise<boolean> {
    const qb = this.repository.createQueryBuilder('empresa')
      .where('empresa.cnpj = :cnpj', { cnpj })
      .andWhere('empresa.isDeleted = false');
    
    if (excludeEmpresaId) {
      qb.andWhere('empresa.empresaId != :excludeEmpresaId', { excludeEmpresaId });
    }
    
    const count = await qb.getCount();
    return count > 0;
  }
}

