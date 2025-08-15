import { BaseController } from '@/core/base/BaseController';
import { FuncionarioContrato } from '@/entities/FuncionarioContrato';
import { FuncionarioContratoService } from '@/services/FuncionarioContratoService';
import { FuncionarioContratoMapper } from '@/mappers/FuncionarioContratoMapper';

export class FuncionarioContratoController extends BaseController<FuncionarioContrato> {
  private funcionariocontratoService: FuncionarioContratoService;

  constructor() {
    super(FuncionarioContrato, FuncionarioContratoMapper);
    this.funcionariocontratoService = new FuncionarioContratoService();
    this.service = this.funcionariocontratoService;
  }
}
