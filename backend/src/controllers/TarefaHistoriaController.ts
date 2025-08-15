import { BaseController } from '@/core/base/BaseController';
import { TarefaHistoria } from '@/entities/TarefaHistoria';
import { TarefaHistoriaService } from '@/services/TarefaHistoriaService';
import { TarefaHistoriaMapper } from '@/mappers/TarefaHistoriaMapper';

export class TarefaHistoriaController extends BaseController<TarefaHistoria> {
  private tarefahistoriaService: TarefaHistoriaService;

  constructor() {
    super(TarefaHistoria, TarefaHistoriaMapper);
    this.tarefahistoriaService = new TarefaHistoriaService();
    this.service = this.tarefahistoriaService;
  }
}
