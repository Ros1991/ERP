import { BaseController } from '@/core/base/BaseController';
import { Role } from '@/entities/Role';
import { RoleService } from '@/services/RoleService';
import { RoleMapper } from '@/mappers/RoleMapper';

export class RoleController extends BaseController<Role> {
  private roleService: RoleService;

  constructor() {
    super(Role, RoleMapper);
    this.roleService = new RoleService();
    this.service = this.roleService;
  }
}
