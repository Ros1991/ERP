import { BaseController } from '@/core/base/BaseController';
import { FuncionarioBeneficioDesconto } from '@/entities/FuncionarioBeneficioDesconto';
import { FuncionarioBeneficioDescontoService } from '@/services/FuncionarioBeneficioDescontoService';
import { FuncionarioBeneficioDescontoMapper } from '@/mappers/FuncionarioBeneficioDescontoMapper';

export class FuncionarioBeneficioDescontoController extends BaseController<FuncionarioBeneficioDesconto> {
  private funcionariobeneficiodescontoService: FuncionarioBeneficioDescontoService;

  constructor() {
    super(FuncionarioBeneficioDesconto, FuncionarioBeneficioDescontoMapper);
    this.funcionariobeneficiodescontoService = new FuncionarioBeneficioDescontoService();
    this.service = this.funcionariobeneficiodescontoService;
  }
}
