import { BaseController } from '@/core/base/BaseController';
import { PedidoCompra } from '@/entities/PedidoCompra';
import { PedidoCompraService } from '@/services/PedidoCompraService';
import { PedidoCompraMapper } from '@/mappers/PedidoCompraMapper';

export class PedidoCompraController extends BaseController<PedidoCompra> {
  private pedidocompraService: PedidoCompraService;

  constructor() {
    super(PedidoCompra, PedidoCompraMapper);
    this.pedidocompraService = new PedidoCompraService();
    this.service = this.pedidocompraService;
  }
}
