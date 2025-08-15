import { BaseService } from '@/core/base/BaseService';
import { UsuarioEmpresa } from '@/entities/UsuarioEmpresa';
import { UsuarioEmpresaRepository } from '@/repositories/UsuarioEmpresaRepository';
import { UsuarioEmpresaMapper } from '@/mappers/UsuarioEmpresaMapper';
import { IDto } from '@/core/base/BaseDto';

export class UsuarioEmpresaService extends BaseService<UsuarioEmpresa> {
  private usuarioempresaRepository: UsuarioEmpresaRepository;

  constructor() {
    const usuarioempresaRepository = new UsuarioEmpresaRepository();
    const usuarioempresaMapper = new UsuarioEmpresaMapper();
    super(UsuarioEmpresa, UsuarioEmpresaMapper, 'UsuarioEmpresa');
    this.usuarioempresaRepository = usuarioempresaRepository;
    this.baseMapper = usuarioempresaMapper;
    this.repository = usuarioempresaRepository;
  }

  /**
   * Validate before creating usuarioempresa
   */
  protected async validateBeforeCreate(createDto: IDto): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before updating usuarioempresa
   */
  protected async validateBeforeUpdate(id: number, updateDto: IDto, existingEntity: UsuarioEmpresa): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before deleting usuarioempresa
   */
  protected async validateBeforeDelete(id: number, entity: UsuarioEmpresa): Promise<void> {
    // Add specific validation logic here
  }
}
