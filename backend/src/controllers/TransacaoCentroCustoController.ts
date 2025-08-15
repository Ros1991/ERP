import { BaseController } from '@/core/base/BaseController';
import { TransacaoCentroCusto } from '@/entities/TransacaoCentroCusto';
import { TransacaoCentroCustoService } from '@/services/TransacaoCentroCustoService';
import { TransacaoCentroCustoMapper } from '@/mappers/TransacaoCentroCustoMapper';

export class TransacaoCentroCustoController extends BaseController<TransacaoCentroCusto> {
  private transacaocentrocustoService: TransacaoCentroCustoService;

  constructor() {
    super(TransacaoCentroCusto, TransacaoCentroCustoMapper);
    this.transacaocentrocustoService = new TransacaoCentroCustoService();
    this.service = this.transacaocentrocustoService;
  }
}
