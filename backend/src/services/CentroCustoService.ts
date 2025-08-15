import { BaseService } from '@/core/base/BaseService';
import { CentroCusto } from '@/entities/CentroCusto';
import { CentroCustoRepository } from '@/repositories/CentroCustoRepository';
import { CentroCustoMapper } from '@/mappers/CentroCustoMapper';
import { IDto } from '@/core/base/BaseDto';
import { AppError } from '@/core/errors/AppError';

export class CentroCustoService extends BaseService<CentroCusto> {
  private centrocustoRepository: CentroCustoRepository;

  constructor() {
    const centrocustoRepository = new CentroCustoRepository();
    const centrocustoMapper = new CentroCustoMapper();
    super(CentroCusto, CentroCustoMapper, 'CentroCusto');
    this.centrocustoRepository = centrocustoRepository;
    this.baseMapper = centrocustoMapper;
    this.repository = centrocustoRepository;
  }

  /**
   * Validate before creating centrocusto
   */
  protected async validateBeforeCreate(createDto: IDto): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before updating centrocusto
   */
  protected async validateBeforeUpdate(id: number, updateDto: IDto, existingEntity: CentroCusto): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before deleting centrocusto
   */
  protected async validateBeforeDelete(id: number, entity: CentroCusto): Promise<void> {
    // Add specific validation logic here
  }
}
