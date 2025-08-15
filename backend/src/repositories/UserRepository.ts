import { BaseRepository } from './BaseRepository';
import { User } from '@/entities/User';
import { FindOptionsWhere, Not } from 'typeorm';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.findOne({ email: email.toLowerCase() });
  }

  async findByEmailWithCompanies(email: string): Promise<User | null> {
    return await this.getRepository().findOne({
      where: { email: email.toLowerCase() },
      relations: [
        'company_memberships',
        'company_memberships.company',
        'company_memberships.role'
      ]
    });
  }

  async findByIdWithCompanies(id: string): Promise<User | null> {
    return await this.getRepository().findOne({
      where: { id },
      relations: [
        'company_memberships',
        'company_memberships.company',
        'company_memberships.role'
      ]
    });
  }

  async findByFacialRecognitionVector(vector: string): Promise<User | null> {
    // Em uma implementação real, aqui seria feita a comparação de vetores biométricos
    // Por enquanto, vamos fazer uma busca simples
    return await this.findOne({ facial_recognition_vector: vector });
  }

  async updateFacialRecognitionVector(userId: string, vector: string): Promise<boolean> {
    const result = await this.getRepository().update(userId, {
      facial_recognition_vector: vector
    });
    return (result.affected ?? 0) > 0;
  }

  async removeFacialRecognitionVector(userId: string): Promise<boolean> {
    const result = await this.getRepository().update(userId, {
      facial_recognition_vector: null
    });
    return (result.affected ?? 0) > 0;
  }

  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    const where: FindOptionsWhere<User> = { email: email.toLowerCase() };
    
    if (excludeId) {
      where.id = Not(excludeId);
    }

    return await this.exists(where);
  }

  async findUsersWithoutCompany(): Promise<User[]> {
    return await this.getRepository()
      .createQueryBuilder('user')
      .leftJoin('user.company_memberships', 'membership')
      .where('membership.id IS NULL')
      .getMany();
  }

  async findUsersByCompany(companyId: string): Promise<User[]> {
    return await this.getRepository()
      .createQueryBuilder('user')
      .innerJoin('user.company_memberships', 'membership')
      .innerJoin('membership.company', 'company')
      .where('company.id = :companyId', { companyId })
      .getMany();
  }

  async searchUsers(searchTerm: string, limit: number = 10): Promise<User[]> {
    return await this.getRepository()
      .createQueryBuilder('user')
      .where('LOWER(user.name) LIKE LOWER(:searchTerm)', { searchTerm: `%${searchTerm}%` })
      .orWhere('LOWER(user.email) LIKE LOWER(:searchTerm)', { searchTerm: `%${searchTerm}%` })
      .limit(limit)
      .getMany();
  }

  async getUserStats(): Promise<{
    total: number;
    withFacialRecognition: number;
    withoutCompany: number;
    recentlyCreated: number;
  }> {
    const total = await this.count();
    
    const withFacialRecognition = await this.getRepository()
      .createQueryBuilder('user')
      .where('user.facial_recognition_vector IS NOT NULL')
      .getCount();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentlyCreated = await this.getRepository()
      .createQueryBuilder('user')
      .where('user.created_at >= :date', { date: thirtyDaysAgo })
      .getCount();

    const withoutCompany = await this.getRepository()
      .createQueryBuilder('user')
      .leftJoin('user.company_memberships', 'membership')
      .where('membership.id IS NULL')
      .getCount();

    return {
      total,
      withFacialRecognition,
      withoutCompany,
      recentlyCreated
    };
  }

  async findActiveUsersByDateRange(startDate: Date, endDate: Date): Promise<User[]> {
    return await this.getRepository()
      .createQueryBuilder('user')
      .where('user.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .orderBy('user.created_at', 'DESC')
      .getMany();
  }
}

