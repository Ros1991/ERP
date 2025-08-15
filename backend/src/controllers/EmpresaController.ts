import { BaseController } from '@/core/base/BaseController';
import { Empresa } from '@/entities/Empresa';
import { EmpresaService } from '@/services/EmpresaService';
import { EmpresaMapper } from '@/mappers/EmpresaMapper';

export class EmpresaController extends BaseController<Empresa> {
  private empresaService: EmpresaService;

  constructor() {
    super(Empresa, EmpresaMapper);
    this.empresaService = new EmpresaService();
    this.service = this.empresaService;
  }
}
