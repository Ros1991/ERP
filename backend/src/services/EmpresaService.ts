import { BaseService } from '@/core/base/BaseService';
import { Empresa } from '@/entities/Empresa';
import { EmpresaRepository } from '@/repositories/EmpresaRepository';
import { EmpresaMapper } from '@/mappers/EmpresaMapper';
import { IDto } from '@/core/base/BaseDto';
import { AppError } from '@/core/errors/AppError';
import { RoleService } from '@/services/RoleService';
import { UsuarioEmpresaService } from '@/services/UsuarioEmpresaService';

export class EmpresaService extends BaseService<Empresa> {
  private empresaRepository: EmpresaRepository;
  private roleService: RoleService;
  private usuarioEmpresaService: UsuarioEmpresaService;

  constructor() {
    const empresaRepository = new EmpresaRepository();
    const empresaMapper = new EmpresaMapper();
    super(Empresa, EmpresaMapper, 'Empresa');
    this.empresaRepository = empresaRepository;
    this.baseMapper = empresaMapper;
    this.repository = empresaRepository;
    this.roleService = new RoleService();
    this.usuarioEmpresaService = new UsuarioEmpresaService();
  }

  /**
   * Validate before creating empresa
   */
  protected async validateBeforeCreate(createDto: IDto): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before updating empresa
   */
  protected async validateBeforeUpdate(id: number, updateDto: IDto, existingEntity: Empresa): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before deleting empresa
   */
  protected async validateBeforeDelete(id: number, entity: Empresa): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * After creating empresa - create default roles and associate user
   */
  protected async afterCreate(entity: Empresa, userId?: number): Promise<void> {
    if (!entity.empresaId) {
      throw new AppError('Empresa ID not found after creation', 500);
    }

    // Create default roles
    const defaultRoles = [
      { nome: 'Dono', permissoes: null },
      { nome: 'Gerente', permissoes: null },
      { nome: 'Funcionario', permissoes: null }
    ];

    const createdRoles = [];
    for (const roleData of defaultRoles) {
      const roleDto = {
        empresaId: entity.empresaId,
        nome: roleData.nome,
        permissoes: roleData.permissoes,
        ativo: true
      };
      const createdRole = await this.roleService.create(roleDto);
      createdRoles.push(createdRole);
    }

    // Associate user with "Dono" role if userId is provided
    if (userId) {
      const donoRole = createdRoles.find(role => (role as any).nome === 'Dono');
      if (donoRole) {
        const usuarioEmpresaDto = {
          userId: userId,
          empresaId: entity.empresaId,
          roleId: (donoRole as any).roleId,
          ativo: true
        };
        await this.usuarioEmpresaService.create(usuarioEmpresaDto);
      }
    }
  }

  /**
   * Create empresa with user context
   */
  async createWithUser(createDto: IDto, userId: number): Promise<IDto> {
    await this.validateBeforeCreate(createDto);
    const entityData = this.baseMapper.toEntity(createDto);
    const entity = await this.repository.create(entityData as any);
    await this.afterCreate(entity, userId);
    return this.baseMapper.toResponseDto(entity);
  }

  /**
   * Get companies by user ID
   */
  async findByUserId(userId: number): Promise<IDto[]> {
    // Get all UsuarioEmpresa records for the user
    const allUsuarioEmpresas = await this.usuarioEmpresaService.findAll();
    const userEmpresas = (allUsuarioEmpresas as any[]).filter(ue => 
      ue.userId === userId && ue.ativo === true
    );
    
    // Get the empresa IDs 
    const empresaIds = userEmpresas.map(ue => ue.empresaId);
    
    if (empresaIds.length === 0) {
      return [];
    }
    
    // Get all empresas and filter by IDs
    const allEmpresas = await this.findAll();
    const userCompanies = (allEmpresas as any[]).filter(empresa => 
      empresaIds.includes(empresa.empresaId)
    );
    
    return userCompanies;
  }
}
