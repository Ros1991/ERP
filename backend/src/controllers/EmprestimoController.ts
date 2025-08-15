import { BaseController } from '@/core/base/BaseController';
import { Emprestimo } from '@/entities/Emprestimo';
import { EmprestimoService } from '@/services/EmprestimoService';
import { EmprestimoMapper } from '@/mappers/EmprestimoMapper';

export class EmprestimoController extends BaseController<Emprestimo> {
  private emprestimoService: EmprestimoService;

  constructor() {
    super(Emprestimo, EmprestimoMapper);
    this.emprestimoService = new EmprestimoService();
    this.service = this.emprestimoService;
  }
}
