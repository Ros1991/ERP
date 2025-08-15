import { BaseService } from '@/core/base/BaseService';
import { Role } from '@/entities/Role';
import { RoleRepository } from '@/repositories/RoleRepository';
import { RoleMapper } from '@/mappers/RoleMapper';
import { IDto } from '@/core/base/BaseDto';
import { AppError } from '@/core/errors/AppError';

export class RoleService extends BaseService<Role> {
  private roleRepository: RoleRepository;

  constructor() {
    const roleRepository = new RoleRepository();
    const roleMapper = new RoleMapper();
    super(Role, RoleMapper, 'Role');
    this.roleRepository = roleRepository;
    this.baseMapper = roleMapper;
    this.repository = roleRepository;
  }

  /**
   * Validate before creating role
   */
  protected async validateBeforeCreate(createDto: IDto): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before updating role
   */
  protected async validateBeforeUpdate(id: number, updateDto: IDto, existingEntity: Role): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before deleting role
   */
  protected async validateBeforeDelete(id: number, entity: Role): Promise<void> {
    // Add specific validation logic here
  }
}
