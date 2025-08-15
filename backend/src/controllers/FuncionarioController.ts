import { BaseController } from '@/core/base/BaseController';
import { Funcionario } from '@/entities/Funcionario';
import { FuncionarioService } from '@/services/FuncionarioService';
import { FuncionarioMapper } from '@/mappers/FuncionarioMapper';

export class FuncionarioController extends BaseController<Funcionario> {
  private funcionarioService: FuncionarioService;

  constructor() {
    super(Funcionario, FuncionarioMapper);
    this.funcionarioService = new FuncionarioService();
    this.service = this.funcionarioService;
  }
}
