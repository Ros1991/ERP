import { BaseService } from '@/core/base/BaseService';
import { FuncionarioContrato } from '@/entities/FuncionarioContrato';
import { FuncionarioContratoRepository } from '@/repositories/FuncionarioContratoRepository';
import { FuncionarioContratoMapper } from '@/mappers/FuncionarioContratoMapper';
import { IDto } from '@/core/base/BaseDto';
import { AppError } from '@/core/errors/AppError';

export class FuncionarioContratoService extends BaseService<FuncionarioContrato> {
  private funcionariocontratoRepository: FuncionarioContratoRepository;

  constructor() {
    const funcionariocontratoRepository = new FuncionarioContratoRepository();
    const funcionariocontratoMapper = new FuncionarioContratoMapper();
    super(FuncionarioContrato, FuncionarioContratoMapper, 'FuncionarioContrato');
    this.funcionariocontratoRepository = funcionariocontratoRepository;
    this.baseMapper = funcionariocontratoMapper;
    this.repository = funcionariocontratoRepository;
  }

  /**
   * Validate before creating funcionariocontrato
   */
  protected async validateBeforeCreate(createDto: IDto): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before updating funcionariocontrato
   */
  protected async validateBeforeUpdate(id: number, updateDto: IDto, existingEntity: FuncionarioContrato): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before deleting funcionariocontrato
   */
  protected async validateBeforeDelete(id: number, entity: FuncionarioContrato): Promise<void> {
    // Add specific validation logic here
  }
}
