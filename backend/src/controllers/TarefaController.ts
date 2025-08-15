import { BaseController } from '@/core/base/BaseController';
import { Tarefa } from '@/entities/Tarefa';
import { TarefaService } from '@/services/TarefaService';
import { TarefaMapper } from '@/mappers/TarefaMapper';

export class TarefaController extends BaseController<Tarefa> {
  private tarefaService: TarefaService;

  constructor() {
    super(Tarefa, TarefaMapper);
    this.tarefaService = new TarefaService();
    this.service = this.tarefaService;
  }
}
