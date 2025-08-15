import { BaseService } from '@/core/base/BaseService';
import { FuncionarioBeneficioDesconto } from '@/entities/FuncionarioBeneficioDesconto';
import { FuncionarioBeneficioDescontoRepository } from '@/repositories/FuncionarioBeneficioDescontoRepository';
import { FuncionarioBeneficioDescontoMapper } from '@/mappers/FuncionarioBeneficioDescontoMapper';
import { IDto } from '@/core/base/BaseDto';
import { AppError } from '@/core/errors/AppError';

export class FuncionarioBeneficioDescontoService extends BaseService<FuncionarioBeneficioDesconto> {
  private funcionariobeneficiodescontoRepository: FuncionarioBeneficioDescontoRepository;

  constructor() {
    const funcionariobeneficiodescontoRepository = new FuncionarioBeneficioDescontoRepository();
    const funcionariobeneficiodescontoMapper = new FuncionarioBeneficioDescontoMapper();
    super(FuncionarioBeneficioDesconto, FuncionarioBeneficioDescontoMapper, 'FuncionarioBeneficioDesconto');
    this.funcionariobeneficiodescontoRepository = funcionariobeneficiodescontoRepository;
    this.baseMapper = funcionariobeneficiodescontoMapper;
    this.repository = funcionariobeneficiodescontoRepository;
  }

  /**
   * Validate before creating funcionariobeneficiodesconto
   */
  protected async validateBeforeCreate(createDto: IDto): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before updating funcionariobeneficiodesconto
   */
  protected async validateBeforeUpdate(id: number, updateDto: IDto, existingEntity: FuncionarioBeneficioDesconto): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before deleting funcionariobeneficiodesconto
   */
  protected async validateBeforeDelete(id: number, entity: FuncionarioBeneficioDesconto): Promise<void> {
    // Add specific validation logic here
  }
}
