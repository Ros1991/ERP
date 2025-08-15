import { BaseController } from '@/core/base/BaseController';
import { Terceiro } from '@/entities/Terceiro';
import { TerceiroService } from '@/services/TerceiroService';
import { TerceiroMapper } from '@/mappers/TerceiroMapper';

export class TerceiroController extends BaseController<Terceiro> {
  private terceiroService: TerceiroService;

  constructor() {
    super(Terceiro, TerceiroMapper);
    this.terceiroService = new TerceiroService();
    this.service = this.terceiroService;
  }
}
