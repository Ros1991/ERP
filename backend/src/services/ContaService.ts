import { BaseService } from '@/core/base/BaseService';
import { Conta } from '@/entities/Conta';
import { ContaRepository } from '@/repositories/ContaRepository';
import { ContaMapper } from '@/mappers/ContaMapper';
import { IDto } from '@/core/base/BaseDto';
import { AppError } from '@/core/errors/AppError';

export class ContaService extends BaseService<Conta> {
  private contaRepository: ContaRepository;

  constructor() {
    const contaRepository = new ContaRepository();
    const contaMapper = new ContaMapper();
    super(Conta, ContaMapper, 'Conta');
    this.contaRepository = contaRepository;
    this.baseMapper = contaMapper;
    this.repository = contaRepository;
  }

  /**
   * Validate before creating conta
   */
  protected async validateBeforeCreate(createDto: IDto): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before updating conta
   */
  protected async validateBeforeUpdate(id: number, updateDto: IDto, existingEntity: Conta): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before deleting conta
   */
  protected async validateBeforeDelete(id: number, entity: Conta): Promise<void> {
    // Add specific validation logic here
  }
}
