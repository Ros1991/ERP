import { BaseController } from '@/core/base/BaseController';
import { TarefaFuncionarioStatusHistoria } from '@/entities/TarefaFuncionarioStatusHistoria';
import { TarefaFuncionarioStatusHistoriaService } from '@/services/TarefaFuncionarioStatusHistoriaService';
import { TarefaFuncionarioStatusHistoriaMapper } from '@/mappers/TarefaFuncionarioStatusHistoriaMapper';

export class TarefaFuncionarioStatusHistoriaController extends BaseController<TarefaFuncionarioStatusHistoria> {
  private tarefafuncionariostatushistoriaService: TarefaFuncionarioStatusHistoriaService;

  constructor() {
    super(TarefaFuncionarioStatusHistoria, TarefaFuncionarioStatusHistoriaMapper);
    this.tarefafuncionariostatushistoriaService = new TarefaFuncionarioStatusHistoriaService();
    this.service = this.tarefafuncionariostatushistoriaService;
  }
}
