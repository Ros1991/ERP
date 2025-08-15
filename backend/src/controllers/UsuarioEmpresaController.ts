import { BaseController } from '@/core/base/BaseController';
import { UsuarioEmpresa } from '@/entities/UsuarioEmpresa';
import { UsuarioEmpresaService } from '@/services/UsuarioEmpresaService';
import { UsuarioEmpresaMapper } from '@/mappers/UsuarioEmpresaMapper';

export class UsuarioEmpresaController extends BaseController<UsuarioEmpresa> {
  private usuarioempresaService: UsuarioEmpresaService;

  constructor() {
    super(UsuarioEmpresa, UsuarioEmpresaMapper);
    this.usuarioempresaService = new UsuarioEmpresaService();
    this.service = this.usuarioempresaService;
  }
}
