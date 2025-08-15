import { SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@/core/base/BaseRepository';
import { Funcionario } from '@/entities/Funcionario';

export class FuncionarioRepository extends BaseRepository<Funcionario> {
  constructor() {
    super(Funcionario, 'funcionarioId');
  }

  /**
   * Apply search filters to query builder
   */
  protected applySearch(qb: SelectQueryBuilder<Funcionario>, search: any): void {
    if (search.empresaId) {
      qb.andWhere('entity.empresaId = :empresaId', { empresaId: search.empresaId });
    }
    
    if (search.nome) {
      qb.andWhere('entity.nome ILIKE :nome', { nome: `%${search.nome}%` });
    }
    
    if (search.apelido) {
      qb.andWhere('entity.apelido ILIKE :apelido', { apelido: `%${search.apelido}%` });
    }
    
    if (search.cpf) {
      qb.andWhere('entity.cpf ILIKE :cpf', { cpf: `%${search.cpf}%` });
    }
    
    if (search.email) {
      qb.andWhere('entity.email ILIKE :email', { email: `%${search.email}%` });
    }
    
    if (search.ativo !== undefined) {
      qb.andWhere('entity.ativo = :ativo', { ativo: search.ativo });
    }

    if (search.isDeleted !== undefined) {
      qb.andWhere('entity.isDeleted = :isDeleted', { isDeleted: search.isDeleted });
    }

  }
}
