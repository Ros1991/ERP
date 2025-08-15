import { BaseController } from '@/core/base/BaseController';
import { CentroCusto } from '@/entities/CentroCusto';
import { CentroCustoService } from '@/services/CentroCustoService';
import { CentroCustoMapper } from '@/mappers/CentroCustoMapper';

export class CentroCustoController extends BaseController<CentroCusto> {
  private centrocustoService: CentroCustoService;

  constructor() {
    super(CentroCusto, CentroCustoMapper);
    this.centrocustoService = new CentroCustoService();
    this.service = this.centrocustoService;
  }
}
