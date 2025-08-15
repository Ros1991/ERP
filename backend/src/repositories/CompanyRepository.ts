import { BaseRepository } from './BaseRepository';
import { Company } from '@/entities/Company';

export class CompanyRepository extends BaseRepository<Company> {
  constructor() {
    super(Company);
  }

  async findByOwnerId(ownerId: string): Promise<Company[]> {
    return await this.findMany({ owner_id: ownerId });
  }

  async findByOwnerIdWithMembers(ownerId: string): Promise<Company[]> {
    return await this.getRepository().find({
      where: { owner_id: ownerId },
      relations: [
        'members',
        'members.user',
        'members.role'
      ]
    });
  }

  async findByIdWithMembers(id: string): Promise<Company | null> {
    return await this.getRepository().findOne({
      where: { id },
      relations: [
        'members',
        'members.user',
        'members.role',
        'owner'
      ]
    });
  }

  async findByIdWithFullDetails(id: string): Promise<Company | null> {
    return await this.getRepository().findOne({
      where: { id },
      relations: [
        'owner',
        'members',
        'members.user',
        'members.role',
        'employees',
        'financial_accounts',
        'cost_centers'
      ]
    });
  }

  async findCompaniesByUserId(userId: string): Promise<Company[]> {
    return await this.getRepository()
      .createQueryBuilder('company')
      .innerJoin('company.members', 'member')
      .where('member.user_id = :userId', { userId })
      .getMany();
  }

  async findCompaniesByUserIdWithRoles(userId: string): Promise<Array<Company & { userRole: any }>> {
    const result = await this.getRepository()
      .createQueryBuilder('company')
      .innerJoin('company.members', 'member')
      .innerJoin('member.role', 'role')
      .where('member.user_id = :userId', { userId })
      .select([
        'company.id',
        'company.name',
        'company.created_at',
        'company.updated_at',
        'role.id',
        'role.name',
        'role.permissions'
      ])
      .getMany();

    return result as any;
  }

  async isUserMember(companyId: string, userId: string): Promise<boolean> {
    const count = await this.getRepository()
      .createQueryBuilder('company')
      .innerJoin('company.members', 'member')
      .where('company.id = :companyId', { companyId })
      .andWhere('member.user_id = :userId', { userId })
      .getCount();

    return count > 0;
  }

  async isUserOwner(companyId: string, userId: string): Promise<boolean> {
    const count = await this.count({
      id: companyId,
      owner_id: userId
    });

    return count > 0;
  }

  async getUserRoleInCompany(companyId: string, userId: string): Promise<any | null> {
    const result = await this.getRepository()
      .createQueryBuilder('company')
      .innerJoin('company.members', 'member')
      .innerJoin('member.role', 'role')
      .where('company.id = :companyId', { companyId })
      .andWhere('member.user_id = :userId', { userId })
      .select([
        'role.id',
        'role.name',
        'role.permissions'
      ])
      .getOne();

    return result ? (result as any).members[0]?.role : null;
  }

  async getCompanyStats(companyId: string): Promise<{
    totalMembers: number;
    totalEmployees: number;
    totalAccounts: number;
    totalCostCenters: number;
  }> {
    const company = await this.getRepository()
      .createQueryBuilder('company')
      .leftJoin('company.members', 'member')
      .leftJoin('company.employees', 'employee')
      .leftJoin('company.financial_accounts', 'account')
      .leftJoin('company.cost_centers', 'cost_center')
      .where('company.id = :companyId', { companyId })
      .select([
        'COUNT(DISTINCT member.id) as totalMembers',
        'COUNT(DISTINCT employee.id) as totalEmployees',
        'COUNT(DISTINCT account.id) as totalAccounts',
        'COUNT(DISTINCT cost_center.id) as totalCostCenters'
      ])
      .getRawOne();

    return {
      totalMembers: parseInt(company.totalMembers) || 0,
      totalEmployees: parseInt(company.totalEmployees) || 0,
      totalAccounts: parseInt(company.totalAccounts) || 0,
      totalCostCenters: parseInt(company.totalCostCenters) || 0
    };
  }

  async searchCompanies(searchTerm: string, limit: number = 10): Promise<Company[]> {
    return await this.getRepository()
      .createQueryBuilder('company')
      .where('LOWER(company.name) LIKE LOWER(:searchTerm)', { searchTerm: `%${searchTerm}%` })
      .limit(limit)
      .getMany();
  }

  async findRecentCompanies(limit: number = 10): Promise<Company[]> {
    return await this.getRepository()
      .createQueryBuilder('company')
      .orderBy('company.created_at', 'DESC')
      .limit(limit)
      .getMany();
  }

  async findCompaniesByDateRange(startDate: Date, endDate: Date): Promise<Company[]> {
    return await this.getRepository()
      .createQueryBuilder('company')
      .where('company.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .orderBy('company.created_at', 'DESC')
      .getMany();
  }

  async getCompaniesWithMemberCount(): Promise<Array<Company & { memberCount: number }>> {
    return await this.getRepository()
      .createQueryBuilder('company')
      .leftJoin('company.members', 'member')
      .select([
        'company.id',
        'company.name',
        'company.created_at',
        'company.updated_at',
        'COUNT(member.id) as memberCount'
      ])
      .groupBy('company.id')
      .orderBy('company.name', 'ASC')
      .getRawAndEntities()
      .then(result => {
        return result.entities.map((company, index) => ({
          ...company,
          memberCount: parseInt(result.raw[index].memberCount) || 0
        }));
      });
  }
}

