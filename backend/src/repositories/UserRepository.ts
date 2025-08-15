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

  /**
   * Set reset token for user
   */
  async setResetToken(userId: number, tokenHash: string, expiresAt: Date): Promise<boolean> {
    const result = await this.repository.update(userId, {
      resetTokenHash: tokenHash,
      resetTokenExpires: expiresAt
    });
    return result.affected !== 0;
  }

  /**
   * Find user by valid reset token
   */
  async findByValidResetToken(tokenHash: string): Promise<User | null> {
    return await this.repository.findOne({
      where: {
        resetTokenHash: tokenHash,
        resetTokenExpires: new Date(), // Should be greater than current date
        isDeleted: false
      }
    });
  }

  /**
   * Find user by valid reset token with proper date comparison
   */
  async findByValidResetTokenWithDate(tokenHash: string): Promise<User | null> {
    return await this.repository
      .createQueryBuilder('user')
      .where('user.resetTokenHash = :tokenHash', { tokenHash })
      .andWhere('user.resetTokenExpires > :now', { now: new Date() })
      .andWhere('user.isDeleted = false')
      .getOne();
  }

  /**
   * Clear reset token for user
   */
  async clearResetToken(userId: number): Promise<boolean> {
    const result = await this.repository.update(userId, {
      resetTokenHash: undefined,
      resetTokenExpires: undefined
    });
    return result.affected !== 0;
  }

  /**
   * Clear expired reset tokens
   */
  async clearExpiredResetTokens(): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(User)
      .set({ 
        resetTokenHash: undefined, 
        resetTokenExpires: undefined 
      })
      .where('resetTokenExpires < :now', { now: new Date() })
      .execute();
  }
}

