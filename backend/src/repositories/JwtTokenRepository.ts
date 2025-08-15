import { SelectQueryBuilder, DeepPartial } from 'typeorm';
import { BaseRepository } from '@/core/base/BaseRepository';
import { JwtToken } from '@/entities/JwtToken';

export class JwtTokenRepository extends BaseRepository<JwtToken> {
  constructor() {
    super(JwtToken, 'tokenId');
  }

  /**
   * Apply search filters to query builder
   */
  protected applySearch(qb: SelectQueryBuilder<JwtToken>, search: any): void {
    if (search.userId) {
      qb.andWhere('entity.userId = :userId', { userId: search.userId });
    }
    
    if (search.tokenHash) {
      qb.andWhere('entity.tokenHash = :tokenHash', { tokenHash: search.tokenHash });
    }

    if (search.expired !== undefined) {
      if (search.expired) {
        qb.andWhere('entity.expirationDate < :now', { now: new Date() });
      } else {
        qb.andWhere('entity.expirationDate >= :now', { now: new Date() });
      }
    }
  }

  /**
   * Find token by hash
   */
  async findByTokenHash(tokenHash: string): Promise<JwtToken | null> {
    return await this.repository.findOne({
      where: { tokenHash },
      relations: ['user']
    });
  }

  /**
   * Find valid tokens for user
   */
  async findValidTokensForUser(userId: number): Promise<JwtToken[]> {
    return await this.repository.find({
      where: { 
        userId,
        expirationDate: new Date() // This will be handled by query builder
      }
    });
  }

  /**
   * Create new JWT token (override to handle no updatedAt column)
   */
  async create(data: DeepPartial<JwtToken>): Promise<JwtToken> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  /**
   * Delete expired tokens
   */
  async deleteExpiredTokens(): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .where('expirationDate < :now', { now: new Date() })
      .execute();
  }
}

