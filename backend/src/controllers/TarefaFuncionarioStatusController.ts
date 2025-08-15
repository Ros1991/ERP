import { BaseController } from '@/core/base/BaseController';
import { TarefaFuncionarioStatus } from '@/entities/TarefaFuncionarioStatus';
import { TarefaFuncionarioStatusService } from '@/services/TarefaFuncionarioStatusService';
import { TarefaFuncionarioStatusMapper } from '@/mappers/TarefaFuncionarioStatusMapper';

export class TarefaFuncionarioStatusController extends BaseController<TarefaFuncionarioStatus> {
  private tarefafuncionariostatusService: TarefaFuncionarioStatusService;

  constructor() {
    super(TarefaFuncionarioStatus, TarefaFuncionarioStatusMapper);
    this.tarefafuncionariostatusService = new TarefaFuncionarioStatusService();
    this.service = this.tarefafuncionariostatusService;
  }
}
