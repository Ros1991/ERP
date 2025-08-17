import { Request, Response } from 'express';
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

  getMyEmpresas = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user?.userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }
      const result = await this.empresaService.findByUserIdWithRole(req.user.userId);
      res.status(200).json(result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user?.userId) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
        return;
      }

      const result = await this.empresaService.createWithUser(req.body, req.user.userId);
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };
}
