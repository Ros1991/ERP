import { BaseService } from '@/core/base/BaseService';
import { TransacaoFinanceira } from '@/entities/TransacaoFinanceira';
import { TransacaoFinanceiraRepository } from '@/repositories/TransacaoFinanceiraRepository';
import { TransacaoFinanceiraMapper } from '@/mappers/TransacaoFinanceiraMapper';
import { IDto } from '@/core/base/BaseDto';
import { AppError } from '@/core/errors/AppError';

export class TransacaoFinanceiraService extends BaseService<TransacaoFinanceira> {
  private transacaofinanceiraRepository: TransacaoFinanceiraRepository;

  constructor() {
    const transacaofinanceiraRepository = new TransacaoFinanceiraRepository();
    const transacaofinanceiraMapper = new TransacaoFinanceiraMapper();
    super(TransacaoFinanceira, TransacaoFinanceiraMapper, 'TransacaoFinanceira');
    this.transacaofinanceiraRepository = transacaofinanceiraRepository;
    this.baseMapper = transacaofinanceiraMapper;
    this.repository = transacaofinanceiraRepository;
  }

  /**
   * Validate before creating transacaofinanceira
   */
  protected async validateBeforeCreate(createDto: IDto): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before updating transacaofinanceira
   */
  protected async validateBeforeUpdate(id: number, updateDto: IDto, existingEntity: TransacaoFinanceira): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before deleting transacaofinanceira
   */
  protected async validateBeforeDelete(id: number, entity: TransacaoFinanceira): Promise<void> {
    // Add specific validation logic here
  }
}
