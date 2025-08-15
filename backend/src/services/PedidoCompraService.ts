import { BaseService } from '@/core/base/BaseService';
import { PedidoCompra } from '@/entities/PedidoCompra';
import { PedidoCompraRepository } from '@/repositories/PedidoCompraRepository';
import { PedidoCompraMapper } from '@/mappers/PedidoCompraMapper';
import { IDto } from '@/core/base/BaseDto';
import { AppError } from '@/core/errors/AppError';

export class PedidoCompraService extends BaseService<PedidoCompra> {
  private pedidocompraRepository: PedidoCompraRepository;

  constructor() {
    const pedidocompraRepository = new PedidoCompraRepository();
    const pedidocompraMapper = new PedidoCompraMapper();
    super(PedidoCompra, PedidoCompraMapper, 'PedidoCompra');
    this.pedidocompraRepository = pedidocompraRepository;
    this.baseMapper = pedidocompraMapper;
    this.repository = pedidocompraRepository;
  }

  /**
   * Validate before creating pedidocompra
   */
  protected async validateBeforeCreate(createDto: IDto): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before updating pedidocompra
   */
  protected async validateBeforeUpdate(id: number, updateDto: IDto, existingEntity: PedidoCompra): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before deleting pedidocompra
   */
  protected async validateBeforeDelete(id: number, entity: PedidoCompra): Promise<void> {
    // Add specific validation logic here
  }
}
