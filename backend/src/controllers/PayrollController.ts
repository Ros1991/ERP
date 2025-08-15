import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { PayrollService } from '../services/PayrollService';
import { 
  CreatePayrollPeriodDto, 
  UpdatePayrollPeriodDto, 
  PayrollFilterDto,
  ProcessPayrollDto
} from '../dtos/PayrollDto';

export class PayrollController extends BaseController {
  private payrollService: PayrollService;

  constructor() {
    super();
    this.payrollService = new PayrollService();
  }

  // Payroll Period endpoints
  async createPayrollPeriod(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const data: CreatePayrollPeriodDto = req.body;

      const payrollPeriod = await this.payrollService.create(companyId, data);
      
      this.sendSuccess(res, payrollPeriod, 'Período de folha criado com sucesso', 201);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getPayrollPeriods(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const filters: PayrollFilterDto = req.query as any;

      const result = await this.payrollService.findByCompanyWithFilters(companyId, filters);
      
      this.sendSuccess(res, result);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getPayrollPeriodById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = req.user?.companyId;
      
      const payrollPeriod = await this.payrollService.findByIdAndCompany(id, companyId);
      
      this.sendSuccess(res, payrollPeriod);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async updatePayrollPeriod(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = req.user?.companyId;
      const data: UpdatePayrollPeriodDto = req.body;

      const payrollPeriod = await this.payrollService.update(id, companyId, data);
      
      this.sendSuccess(res, payrollPeriod, 'Período de folha atualizado com sucesso');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async deletePayrollPeriod(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = req.user?.companyId;

      await this.payrollService.delete(id, companyId);
      
      this.sendSuccess(res, null, 'Período de folha excluído com sucesso');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getPayrollPeriodStats(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const stats = await this.payrollService.getPayrollPeriodStats(companyId);
      
      this.sendSuccess(res, stats);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async processPayroll(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const processedByUserId = req.user?.id;
      const data: ProcessPayrollDto = req.body;

      const payrollPeriod = await this.payrollService.processPayroll(companyId, data, processedByUserId);
      
      this.sendSuccess(res, payrollPeriod, 'Folha de pagamento processada com sucesso');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async markPayrollAsPaid(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = req.user?.companyId;

      const payrollPeriod = await this.payrollService.markAsPaid(id, companyId);
      
      this.sendSuccess(res, payrollPeriod, 'Período marcado como pago com sucesso');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getPayrollPeriodsByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;
      const companyId = req.user?.companyId;
      
      const payrollPeriods = await this.payrollService.getPayrollPeriodsByStatus(companyId, status as any);
      
      this.sendSuccess(res, payrollPeriods);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getPayrollPeriodsByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const companyId = req.user?.companyId;
      
      const payrollPeriods = await this.payrollService.getPayrollPeriodsByType(companyId, type as any);
      
      this.sendSuccess(res, payrollPeriods);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getPayrollPeriodsByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const { startDate, endDate } = req.query;

      const payrollPeriods = await this.payrollService.getPayrollPeriodsByDateRange(
        companyId, 
        new Date(startDate as string), 
        new Date(endDate as string)
      );
      
      this.sendSuccess(res, payrollPeriods);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async searchPayrollPeriods(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const { q } = req.query;

      const payrollPeriods = await this.payrollService.searchPayrollPeriods(companyId, q as string);
      
      this.sendSuccess(res, payrollPeriods);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getRecentPayrollPeriods(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const { limit } = req.query;
      
      const payrollPeriods = await this.payrollService.getRecentPayrollPeriods(
        companyId, 
        limit ? parseInt(limit as string) : undefined
      );
      
      this.sendSuccess(res, payrollPeriods);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getActivePayrollPeriods(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const payrollPeriods = await this.payrollService.getActivePayrollPeriods(companyId);
      
      this.sendSuccess(res, payrollPeriods);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getPayrollSummaryByMonth(req: Request, res: Response): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      const { year } = req.query;

      const summary = await this.payrollService.getPayrollSummaryByMonth(
        companyId, 
        year ? parseInt(year as string) : new Date().getFullYear()
      );
      
      this.sendSuccess(res, summary);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getEmployeePayrollSummary(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = req.user?.companyId;

      const summary = await this.payrollService.getEmployeePayrollSummary(id, companyId);
      
      this.sendSuccess(res, summary);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getPayrollItemStats(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const companyId = req.user?.companyId;

      const stats = await this.payrollService.getPayrollItemStats(id, companyId);
      
      this.sendSuccess(res, stats);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async duplicateFromPreviousPeriod(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { fromPayrollPeriodId } = req.body;
      const companyId = req.user?.companyId;

      const payrollPeriod = await this.payrollService.duplicateFromPreviousPeriod(
        id, 
        companyId, 
        fromPayrollPeriodId
      );
      
      this.sendSuccess(res, payrollPeriod, 'Itens duplicados do período anterior com sucesso');
    } catch (error) {
      this.handleError(res, error);
    }
  }
}

