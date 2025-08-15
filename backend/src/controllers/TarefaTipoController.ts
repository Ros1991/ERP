import { BaseController } from '@/core/base/BaseController';
import { TarefaTipo } from '@/entities/TarefaTipo';
import { TarefaTipoService } from '@/services/TarefaTipoService';
import { TarefaTipoMapper } from '@/mappers/TarefaTipoMapper';

export class TarefaTipoController extends BaseController<TarefaTipo> {
  private tarefatipoService: TarefaTipoService;

  constructor() {
    super(TarefaTipo, TarefaTipoMapper);
    this.tarefatipoService = new TarefaTipoService();
    this.service = this.tarefatipoService;
  }
}
