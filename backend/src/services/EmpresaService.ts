import { BaseService } from '@/core/base/BaseService';
import { Empresa } from '@/entities/Empresa';
import { EmpresaRepository } from '@/repositories/EmpresaRepository';
import { EmpresaMapper } from '@/mappers/EmpresaMapper';
import { IDto } from '@/core/base/BaseDto';
import { AppError } from '@/core/errors/AppError';

export class EmpresaService extends BaseService<Empresa> {
  private empresaRepository: EmpresaRepository;

  constructor() {
    const empresaRepository = new EmpresaRepository();
    const empresaMapper = new EmpresaMapper();
    super(Empresa, EmpresaMapper, 'Empresa');
    this.empresaRepository = empresaRepository;
    this.baseMapper = empresaMapper;
    this.repository = empresaRepository;
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
}
