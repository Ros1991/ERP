import { BaseRepository } from './BaseRepository';
import { Role } from '@/entities/Role';
import { Not } from 'typeorm';

export class RoleRepository extends BaseRepository<Role> {
  constructor() {
    super(Role);
  }

  async findByCompanyId(companyId: string): Promise<Role[]> {
    return await this.findMany({ company_id: companyId });
  }

  async findByCompanyIdAndName(companyId: string, name: string): Promise<Role | null> {
    return await this.findOne({ company_id: companyId, name });
  }

  async findByIdAndCompany(id: number, companyId: string): Promise<Role | null> {
    return await this.findOne({ id, company_id: companyId });
  }

  async roleNameExists(companyId: string, name: string, excludeId?: number): Promise<boolean> {
    const where: any = { company_id: companyId, name };
    
    if (excludeId) {
      where.id = Not(excludeId);
    }

    return await this.exists(where);
  }

  async findRolesWithPermission(companyId: string, permission: string): Promise<Role[]> {
    return await this.getRepository()
      .createQueryBuilder('role')
      .where('role.company_id = :companyId', { companyId })
      .andWhere('role.permissions @> :permission', { permission: JSON.stringify([permission]) })
      .getMany();
  }

  async findRolesWithAnyPermissions(companyId: string, permissions: string[]): Promise<Role[]> {
    return await this.getRepository()
      .createQueryBuilder('role')
      .where('role.company_id = :companyId', { companyId })
      .andWhere('role.permissions ?| array[:...permissions]', { permissions })
      .getMany();
  }

  async findRolesWithAllPermissions(companyId: string, permissions: string[]): Promise<Role[]> {
    return await this.getRepository()
      .createQueryBuilder('role')
      .where('role.company_id = :companyId', { companyId })
      .andWhere('role.permissions @> :permissions', { permissions: JSON.stringify(permissions) })
      .getMany();
  }

  async getRoleStats(companyId: string): Promise<{
    totalRoles: number;
    rolesWithMembers: number;
    mostUsedRole: { name: string; memberCount: number } | null;
  }> {
    const totalRoles = await this.count({ company_id: companyId });

    const rolesWithMemberCounts = await this.getRepository()
      .createQueryBuilder('role')
      .leftJoin('role.company_members', 'member')
      .where('role.company_id = :companyId', { companyId })
      .select(['role.name', 'COUNT(member.id) as memberCount'])
      .groupBy('role.id, role.name')
      .getRawMany();

    const rolesWithMembers = rolesWithMemberCounts.filter(role => parseInt(role.memberCount) > 0).length;

    const mostUsedRole = rolesWithMemberCounts.reduce((max, current) => {
      const currentCount = parseInt(current.memberCount);
      const maxCount = max ? parseInt(max.memberCount) : 0;
      return currentCount > maxCount ? current : max;
    }, null);

    return {
      totalRoles,
      rolesWithMembers,
      mostUsedRole: mostUsedRole ? {
        name: mostUsedRole.name,
        memberCount: parseInt(mostUsedRole.memberCount)
      } : null
    };
  }

  async findRolesWithMemberCount(companyId: string): Promise<Array<Role & { memberCount: number }>> {
    return await this.getRepository()
      .createQueryBuilder('role')
      .leftJoin('role.company_members', 'member')
      .where('role.company_id = :companyId', { companyId })
      .select([
        'role.id',
        'role.name',
        'role.permissions',
        'COUNT(member.id) as memberCount'
      ])
      .groupBy('role.id')
      .orderBy('role.name', 'ASC')
      .getRawAndEntities()
      .then(result => {
        return result.entities.map((role, index) => ({
          ...role,
          memberCount: parseInt(result.raw[index].memberCount) || 0
        }));
      });
  }

  async searchRoles(companyId: string, searchTerm: string): Promise<Role[]> {
    return await this.getRepository()
      .createQueryBuilder('role')
      .where('role.company_id = :companyId', { companyId })
      .andWhere('LOWER(role.name) LIKE LOWER(:searchTerm)', { searchTerm: `%${searchTerm}%` })
      .orderBy('role.name', 'ASC')
      .getMany();
  }

  async createDefaultRoles(companyId: string): Promise<Role[]> {
    const defaultRoles = [
      {
        company_id: companyId,
        name: 'Dono',
        permissions: [
          'company.manage',
          'users.manage',
          'roles.manage',
          'employees.manage',
          'financial.manage',
          'tasks.manage',
          'payroll.manage',
          'purchases.manage',
          'reports.view'
        ]
      },
      {
        company_id: companyId,
        name: 'Admin',
        permissions: [
          'users.manage',
          'employees.manage',
          'financial.manage',
          'tasks.manage',
          'payroll.manage',
          'purchases.manage',
          'reports.view'
        ]
      },
      {
        company_id: companyId,
        name: 'Gerente',
        permissions: [
          'employees.view',
          'financial.view',
          'tasks.manage',
          'payroll.view',
          'purchases.view',
          'reports.view'
        ]
      },
      {
        company_id: companyId,
        name: 'Funcionário',
        permissions: [
          'tasks.view',
          'tasks.update_own',
          'purchases.create',
          'reports.view_own'
        ]
      }
    ];

    return await this.createMany(defaultRoles);
  }

  async duplicateRole(roleId: number, newName: string): Promise<Role> {
    const originalRole = await this.findById(roleId);
    if (!originalRole) {
      throw new Error('Perfil não encontrado');
    }

    const duplicatedRole = {
      company_id: originalRole.company_id,
      name: newName,
      permissions: originalRole.permissions
    };

    return await this.create(duplicatedRole);
  }

  async updatePermissions(roleId: number, permissions: string[]): Promise<boolean> {
    const result = await this.getRepository().update(roleId, { permissions });
    return (result.affected ?? 0) > 0;
  }

  async addPermissions(roleId: number, newPermissions: string[]): Promise<boolean> {
    const role = await this.findById(roleId);
    if (!role) {
      return false;
    }

    const currentPermissions = role.permissions || [];
    const updatedPermissions = [...new Set([...currentPermissions, ...newPermissions])];

    return await this.updatePermissions(roleId, updatedPermissions);
  }

  async removePermissions(roleId: number, permissionsToRemove: string[]): Promise<boolean> {
    const role = await this.findById(roleId);
    if (!role) {
      return false;
    }

    const currentPermissions = role.permissions || [];
    const updatedPermissions = currentPermissions.filter(p => !permissionsToRemove.includes(p));

    return await this.updatePermissions(roleId, updatedPermissions);
  }
}

