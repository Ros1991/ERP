import { BaseController } from '@/core/base/BaseController';
import { TransacaoFinanceira } from '@/entities/TransacaoFinanceira';
import { TransacaoFinanceiraService } from '@/services/TransacaoFinanceiraService';
import { TransacaoFinanceiraMapper } from '@/mappers/TransacaoFinanceiraMapper';

export class TransacaoFinanceiraController extends BaseController<TransacaoFinanceira> {
  private transacaofinanceiraService: TransacaoFinanceiraService;

  constructor() {
    super(TransacaoFinanceira, TransacaoFinanceiraMapper);
    this.transacaofinanceiraService = new TransacaoFinanceiraService();
    this.service = this.transacaofinanceiraService;
  }
}
