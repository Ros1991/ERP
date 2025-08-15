import { BaseService } from '@/core/base/BaseService';
import { TransacaoCentroCusto } from '@/entities/TransacaoCentroCusto';
import { TransacaoCentroCustoRepository } from '@/repositories/TransacaoCentroCustoRepository';
import { TransacaoCentroCustoMapper } from '@/mappers/TransacaoCentroCustoMapper';
import { IDto } from '@/core/base/BaseDto';
import { AppError } from '@/core/errors/AppError';

export class TransacaoCentroCustoService extends BaseService<TransacaoCentroCusto> {
  private transacaocentrocustoRepository: TransacaoCentroCustoRepository;

  constructor() {
    const transacaocentrocustoRepository = new TransacaoCentroCustoRepository();
    const transacaocentrocustoMapper = new TransacaoCentroCustoMapper();
    super(TransacaoCentroCusto, TransacaoCentroCustoMapper, 'TransacaoCentroCusto');
    this.transacaocentrocustoRepository = transacaocentrocustoRepository;
    this.baseMapper = transacaocentrocustoMapper;
    this.repository = transacaocentrocustoRepository;
  }

  /**
   * Validate before creating transacaocentrocusto
   */
  protected async validateBeforeCreate(createDto: IDto): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before updating transacaocentrocusto
   */
  protected async validateBeforeUpdate(id: number, updateDto: IDto, existingEntity: TransacaoCentroCusto): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before deleting transacaocentrocusto
   */
  protected async validateBeforeDelete(id: number, entity: TransacaoCentroCusto): Promise<void> {
    // Add specific validation logic here
  }
}
