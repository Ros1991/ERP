import { BaseRepository } from './BaseRepository';
import { CompanyMember } from '@/entities/CompanyMember';

export class CompanyMemberRepository extends BaseRepository<CompanyMember> {
  constructor() {
    super(CompanyMember);
  }

  async findByUserAndCompany(userId: string, companyId: string): Promise<CompanyMember | null> {
    return await this.getRepository().findOne({
      where: { user_id: userId, company_id: companyId },
      relations: ['user', 'company', 'role']
    });
  }

  async findByCompanyId(companyId: string): Promise<CompanyMember[]> {
    return await this.getRepository().find({
      where: { company_id: companyId },
      relations: ['user', 'role']
    });
  }

  async findByUserId(userId: string): Promise<CompanyMember[]> {
    return await this.getRepository().find({
      where: { user_id: userId },
      relations: ['company', 'role']
    });
  }

  async findByCompanyIdWithDetails(companyId: string): Promise<CompanyMember[]> {
    return await this.getRepository().find({
      where: { company_id: companyId },
      relations: ['user', 'company', 'role'],
      order: { user: { name: 'ASC' } }
    });
  }

  async findByUserIdWithDetails(userId: string): Promise<CompanyMember[]> {
    return await this.getRepository().find({
      where: { user_id: userId },
      relations: ['user', 'company', 'role'],
      order: { company: { name: 'ASC' } }
    });
  }

  async membershipExists(userId: string, companyId: string): Promise<boolean> {
    return await this.exists({ user_id: userId, company_id: companyId });
  }

  async removeMembership(userId: string, companyId: string): Promise<boolean> {
    const result = await this.getRepository().delete({
      user_id: userId,
      company_id: companyId
    });
    return (result.affected ?? 0) > 0;
  }

  async updateMemberRole(userId: string, companyId: string, roleId: number): Promise<boolean> {
    const result = await this.getRepository().update(
      { user_id: userId, company_id: companyId },
      { role_id: roleId }
    );
    return (result.affected ?? 0) > 0;
  }

  async getMembersByRole(companyId: string, roleId: number): Promise<CompanyMember[]> {
    return await this.getRepository().find({
      where: { company_id: companyId, role_id: roleId },
      relations: ['user', 'role']
    });
  }

  async getMembersByRoleName(companyId: string, roleName: string): Promise<CompanyMember[]> {
    return await this.getRepository()
      .createQueryBuilder('member')
      .innerJoin('member.role', 'role')
      .innerJoin('member.user', 'user')
      .where('member.company_id = :companyId', { companyId })
      .andWhere('role.name = :roleName', { roleName })
      .select(['member', 'user.id', 'user.name', 'user.email', 'role.id', 'role.name'])
      .getMany();
  }

  async getCompanyMemberStats(companyId: string): Promise<{
    totalMembers: number;
    membersByRole: Array<{ roleName: string; count: number }>;
  }> {
    const totalMembers = await this.count({ company_id: companyId });

    const membersByRole = await this.getRepository()
      .createQueryBuilder('member')
      .innerJoin('member.role', 'role')
      .where('member.company_id = :companyId', { companyId })
      .select(['role.name as roleName', 'COUNT(member.id) as count'])
      .groupBy('role.name')
      .getRawMany();

    return {
      totalMembers,
      membersByRole: membersByRole.map(item => ({
        roleName: item.roleName,
        count: parseInt(item.count)
      }))
    };
  }

  async findMembersWithPermission(companyId: string, permission: string): Promise<CompanyMember[]> {
    return await this.getRepository()
      .createQueryBuilder('member')
      .innerJoin('member.role', 'role')
      .innerJoin('member.user', 'user')
      .where('member.company_id = :companyId', { companyId })
      .andWhere('role.permissions @> :permission', { permission: JSON.stringify([permission]) })
      .select(['member', 'user.id', 'user.name', 'user.email', 'role.id', 'role.name', 'role.permissions'])
      .getMany();
  }

  async searchMembers(companyId: string, searchTerm: string): Promise<CompanyMember[]> {
    return await this.getRepository()
      .createQueryBuilder('member')
      .innerJoin('member.user', 'user')
      .innerJoin('member.role', 'role')
      .where('member.company_id = :companyId', { companyId })
      .andWhere(
        '(LOWER(user.name) LIKE LOWER(:searchTerm) OR LOWER(user.email) LIKE LOWER(:searchTerm))',
        { searchTerm: `%${searchTerm}%` }
      )
      .select(['member', 'user.id', 'user.name', 'user.email', 'role.id', 'role.name'])
      .getMany();
  }

  async getRecentMembers(companyId: string, limit: number = 10): Promise<CompanyMember[]> {
    return await this.getRepository()
      .createQueryBuilder('member')
      .innerJoin('member.user', 'user')
      .innerJoin('member.role', 'role')
      .where('member.company_id = :companyId', { companyId })
      .orderBy('member.id', 'DESC')
      .limit(limit)
      .select(['member', 'user.id', 'user.name', 'user.email', 'role.id', 'role.name'])
      .getMany();
  }

  async bulkUpdateRoles(companyId: string, updates: Array<{ userId: string; roleId: number }>): Promise<void> {
    await this.getRepository().manager.transaction(async (manager) => {
      for (const update of updates) {
        await manager.update(CompanyMember, 
          { user_id: update.userId, company_id: companyId },
          { role_id: update.roleId }
        );
      }
    });
  }

  async bulkRemoveMembers(companyId: string, userIds: string[]): Promise<number> {
    const result = await this.getRepository()
      .createQueryBuilder()
      .delete()
      .from(CompanyMember)
      .where('company_id = :companyId', { companyId })
      .andWhere('user_id IN (:...userIds)', { userIds })
      .execute();
      
    return result.affected ?? 0;
  }
}

