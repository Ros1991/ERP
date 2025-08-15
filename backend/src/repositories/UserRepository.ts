import { SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@/core/base/BaseRepository';
import { User } from '@/entities/User';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User, 'userId');
  }

  /**
   * Apply search filters to query builder
   */
  protected applySearch(qb: SelectQueryBuilder<User>, search: any): void {
    if (search.email) {
      qb.andWhere('entity.email ILIKE :email', { email: `%${search.email}%` });
    }
    
    if (search.nome) {
      qb.andWhere('entity.nome ILIKE :nome', { nome: `%${search.nome}%` });
    }

    if (search.isDeleted !== undefined) {
      qb.andWhere('entity.isDeleted = :isDeleted', { isDeleted: search.isDeleted });
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { email, isDeleted: false }
    });
  }

  /**
   * Check if email exists (excluding current user)
   */
  async emailExists(email: string, excludeUserId?: number): Promise<boolean> {
    const qb = this.repository.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .andWhere('user.isDeleted = false');
    
    if (excludeUserId) {
      qb.andWhere('user.userId != :excludeUserId', { excludeUserId });
    }
    
    const count = await qb.getCount();
    return count > 0;
  }
}

