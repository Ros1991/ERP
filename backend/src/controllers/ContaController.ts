import { BaseController } from '@/core/base/BaseController';
import { Conta } from '@/entities/Conta';
import { ContaService } from '@/services/ContaService';
import { ContaMapper } from '@/mappers/ContaMapper';

export class ContaController extends BaseController<Conta> {
  private contaService: ContaService;

  constructor() {
    super(Conta, ContaMapper);
    this.contaService = new ContaService();
    this.service = this.contaService;
  }
}
