import { BaseService } from './BaseService';
import { PayrollPeriod } from '../entities/PayrollPeriod';
import { PayrollPeriodRepository } from '../repositories/PayrollPeriodRepository';
import { PayrollItemRepository } from '../repositories/PayrollItemRepository';
import { EmployeeRepository } from '../repositories/EmployeeRepository';
import { UserRepository } from '../repositories/UserRepository';
import { AppError } from '../utils/AppError';
import { 
  CreatePayrollPeriodDto, 
  UpdatePayrollPeriodDto, 
  PayrollFilterDto,
  ProcessPayrollDto,
  PayrollStatus,
  PayrollPeriodType,
  PayrollItemType,
  PayrollCalculationType
} from '../dtos/PayrollDto';
import { PaginatedResult } from '../utils/PaginationFactory';

export class PayrollService extends BaseService<PayrollPeriod, CreatePayrollPeriodDto, UpdatePayrollPeriodDto> {
  private payrollItemRepository: PayrollItemRepository;
  private employeeRepository: EmployeeRepository;
  private userRepository: UserRepository;

  constructor() {
    const payrollPeriodRepository = new PayrollPeriodRepository();
    super(payrollPeriodRepository);
    this.payrollItemRepository = new PayrollItemRepository();
    this.employeeRepository = new EmployeeRepository();
    this.userRepository = new UserRepository();
  }

  async create(companyId: string, data: CreatePayrollPeriodDto): Promise<PayrollPeriod> {
    // Verificar se não há períodos sobrepostos
    const overlappingPeriods = await (this.repository as PayrollPeriodRepository)
      .findOverlappingPeriods(companyId, new Date(data.period_start), new Date(data.period_end));
    
    if (overlappingPeriods.length > 0) {
      throw AppError.conflict('Já existe um período de folha que sobrepõe as datas informadas');
    }

    // Criar período de folha
    const payrollPeriodData = {
      company_id: companyId,
      name: data.name,
      description: data.description || null,
      period_type: data.period_type,
      period_start: new Date(data.period_start),
      period_end: new Date(data.period_end),
      payment_date: data.payment_date ? new Date(data.payment_date) : null,
      total_gross: 0,
      total_deductions: 0,
      total_net: 0,
      status: data.status || PayrollStatus.RASCUNHO,
      processed_at: null,
      processed_by_user_id: null
    };

    return await this.repository.create(payrollPeriodData);
  }

  async update(payrollPeriodId: string, companyId: string, data: UpdatePayrollPeriodDto): Promise<PayrollPeriod> {
    const payrollPeriod = await this.findByIdAndCompany(payrollPeriodId, companyId);

    // Não permitir alteração de períodos processados ou pagos
    if (payrollPeriod.status === PayrollStatus.PROCESSADA || payrollPeriod.status === PayrollStatus.PAGA) {
      throw AppError.badRequest('Não é possível alterar um período de folha processado ou pago');
    }

    // Verificar sobreposição se as datas foram alteradas
    if (data.period_start || data.period_end) {
      const startDate = data.period_start ? new Date(data.period_start) : payrollPeriod.period_start;
      const endDate = data.period_end ? new Date(data.period_end) : payrollPeriod.period_end;

      const overlappingPeriods = await (this.repository as PayrollPeriodRepository)
        .findOverlappingPeriods(companyId, startDate, endDate, payrollPeriodId);
      
      if (overlappingPeriods.length > 0) {
        throw AppError.conflict('As novas datas sobrepõem um período existente');
      }
    }

    // Preparar dados para atualização
    const updateData: any = {};
    
    if (data.name) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.period_start) updateData.period_start = new Date(data.period_start);
    if (data.period_end) updateData.period_end = new Date(data.period_end);
    if (data.payment_date !== undefined) {
      updateData.payment_date = data.payment_date ? new Date(data.payment_date) : null;
    }
    if (data.status) updateData.status = data.status;

    return await this.repository.update(payrollPeriodId, updateData) as PayrollPeriod;
  }

  async findByIdAndCompany(payrollPeriodId: string, companyId: string): Promise<PayrollPeriod> {
    const payrollPeriod = await (this.repository as PayrollPeriodRepository).findByIdWithDetails(payrollPeriodId);
    
    if (!payrollPeriod || payrollPeriod.company_id !== companyId) {
      throw AppError.notFound('Período de folha não encontrado');
    }

    return payrollPeriod;
  }

  async findByCompanyWithFilters(companyId: string, filters: PayrollFilterDto): Promise<PaginatedResult<PayrollPeriod>> {
    return await (this.repository as PayrollPeriodRepository).findWithFilters(companyId, filters);
  }

  async getPayrollPeriodStats(companyId: string): Promise<any> {
    return await (this.repository as PayrollPeriodRepository).getPayrollPeriodStats(companyId);
  }

  async processPayroll(companyId: string, data: ProcessPayrollDto, processedByUserId: string): Promise<PayrollPeriod> {
    const payrollPeriod = await this.findByIdAndCompany(data.payroll_period_id, companyId);

    // Verificar se o período pode ser processado
    if (payrollPeriod.status === PayrollStatus.PROCESSADA) {
      if (!data.recalculate) {
        throw AppError.badRequest('Período já foi processado. Use recalculate=true para reprocessar');
      }
    }

    if (payrollPeriod.status === PayrollStatus.PAGA) {
      throw AppError.badRequest('Não é possível reprocessar um período já pago');
    }

    // Marcar como em processamento
    await this.repository.update(data.payroll_period_id, {
      status: PayrollStatus.EM_PROCESSAMENTO
    });

    try {
      // Obter funcionários para processar
      let employees;
      if (data.employee_ids && data.employee_ids.length > 0) {
        employees = [];
        for (const employeeId of data.employee_ids) {
          const employee = await this.employeeRepository.findById(employeeId);
          if (employee && employee.company_id === companyId) {
            employees.push(employee);
          }
        }
      } else {
        employees = await this.employeeRepository.findByCompanyId(companyId);
      }

      // Limpar itens existentes se for recálculo
      if (data.recalculate) {
        await this.payrollItemRepository.deleteByPayrollPeriod(data.payroll_period_id);
      }

      // Processar cada funcionário
      for (const employee of employees) {
        await this.processEmployeePayroll(data.payroll_period_id, employee.id, payrollPeriod);
      }

      // Atualizar totais do período
      await (this.repository as PayrollPeriodRepository).updateTotals(data.payroll_period_id);

      // Marcar como processado
      await (this.repository as PayrollPeriodRepository)
        .markAsProcessed(data.payroll_period_id, processedByUserId);

      return await this.findByIdAndCompany(data.payroll_period_id, companyId);

    } catch (error) {
      // Reverter status em caso de erro
      await this.repository.update(data.payroll_period_id, {
        status: PayrollStatus.RASCUNHO
      });
      throw error;
    }
  }

  private async processEmployeePayroll(payrollPeriodId: string, employeeId: string, payrollPeriod: PayrollPeriod): Promise<void> {
    const employee = await this.employeeRepository.findByIdWithDetails(employeeId);
    if (!employee) return;

    const payrollItems = [];

    // Salário base
    if (employee.salary > 0) {
      payrollItems.push({
        payroll_period_id: payrollPeriodId,
        employee_id: employeeId,
        item_type: PayrollItemType.SALARIO_BASE,
        description: 'Salário Base',
        calculation_type: PayrollCalculationType.FIXO,
        base_value: employee.salary,
        calculated_value: employee.salary,
        legal_reference: 'CLT Art. 457'
      });
    }

    // Calcular INSS (exemplo simplificado)
    const inssValue = this.calculateINSS(employee.salary);
    if (inssValue > 0) {
      payrollItems.push({
        payroll_period_id: payrollPeriodId,
        employee_id: employeeId,
        item_type: PayrollItemType.INSS,
        description: 'INSS',
        calculation_type: PayrollCalculationType.PERCENTUAL,
        base_value: employee.salary,
        calculated_value: -inssValue, // Negativo para desconto
        legal_reference: 'Lei 8.213/91'
      });
    }

    // Calcular IRRF (exemplo simplificado)
    const irrfValue = this.calculateIRRF(employee.salary - inssValue);
    if (irrfValue > 0) {
      payrollItems.push({
        payroll_period_id: payrollPeriodId,
        employee_id: employeeId,
        item_type: PayrollItemType.IRRF,
        description: 'Imposto de Renda Retido na Fonte',
        calculation_type: PayrollCalculationType.PERCENTUAL,
        base_value: employee.salary - inssValue,
        calculated_value: -irrfValue, // Negativo para desconto
        legal_reference: 'Lei 7.713/88'
      });
    }

    // Calcular FGTS
    const fgtsValue = this.calculateFGTS(employee.salary);
    if (fgtsValue > 0) {
      payrollItems.push({
        payroll_period_id: payrollPeriodId,
        employee_id: employeeId,
        item_type: PayrollItemType.FGTS,
        description: 'FGTS',
        calculation_type: PayrollCalculationType.PERCENTUAL,
        base_value: employee.salary,
        calculated_value: fgtsValue, // FGTS não é descontado do funcionário
        legal_reference: 'Lei 8.036/90'
      });
    }

    // Adicionar outros itens baseados no tipo de contrato, benefícios, etc.
    // Aqui seria implementada a lógica específica da empresa

    // Salvar todos os itens
    if (payrollItems.length > 0) {
      await this.payrollItemRepository.bulkCreateItems(payrollItems);
    }
  }

  private calculateINSS(salary: number): number {
    // Tabela INSS 2024 (exemplo simplificado)
    if (salary <= 1412.00) {
      return salary * 0.075;
    } else if (salary <= 2666.68) {
      return (1412.00 * 0.075) + ((salary - 1412.00) * 0.09);
    } else if (salary <= 4000.03) {
      return (1412.00 * 0.075) + ((2666.68 - 1412.00) * 0.09) + ((salary - 2666.68) * 0.12);
    } else if (salary <= 7786.02) {
      return (1412.00 * 0.075) + ((2666.68 - 1412.00) * 0.09) + ((4000.03 - 2666.68) * 0.12) + ((salary - 4000.03) * 0.14);
    } else {
      return 908.85; // Teto do INSS
    }
  }

  private calculateIRRF(baseValue: number): number {
    // Tabela IRRF 2024 (exemplo simplificado)
    if (baseValue <= 2112.00) {
      return 0;
    } else if (baseValue <= 2826.65) {
      return (baseValue * 0.075) - 158.40;
    } else if (baseValue <= 3751.05) {
      return (baseValue * 0.15) - 370.40;
    } else if (baseValue <= 4664.68) {
      return (baseValue * 0.225) - 651.73;
    } else {
      return (baseValue * 0.275) - 884.96;
    }
  }

  private calculateFGTS(salary: number): number {
    return salary * 0.08; // 8% sobre o salário
  }

  async markAsPaid(payrollPeriodId: string, companyId: string): Promise<PayrollPeriod> {
    const payrollPeriod = await this.findByIdAndCompany(payrollPeriodId, companyId);

    if (payrollPeriod.status !== PayrollStatus.PROCESSADA) {
      throw AppError.badRequest('Apenas períodos processados podem ser marcados como pagos');
    }

    await (this.repository as PayrollPeriodRepository).markAsPaid(payrollPeriodId);

    return await this.findByIdAndCompany(payrollPeriodId, companyId);
  }

  async getPayrollPeriodsByStatus(companyId: string, status: PayrollStatus): Promise<PayrollPeriod[]> {
    return await (this.repository as PayrollPeriodRepository).findByStatus(companyId, status);
  }

  async getPayrollPeriodsByType(companyId: string, periodType: PayrollPeriodType): Promise<PayrollPeriod[]> {
    return await (this.repository as PayrollPeriodRepository).findByPeriodType(companyId, periodType);
  }

  async getPayrollPeriodsByDateRange(companyId: string, startDate: Date, endDate: Date): Promise<PayrollPeriod[]> {
    return await (this.repository as PayrollPeriodRepository).findByDateRange(companyId, startDate, endDate);
  }

  async searchPayrollPeriods(companyId: string, searchTerm: string): Promise<PayrollPeriod[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw AppError.badRequest('Termo de busca deve ter pelo menos 2 caracteres');
    }

    return await (this.repository as PayrollPeriodRepository)
      .searchPayrollPeriods(companyId, searchTerm.trim());
  }

  async getRecentPayrollPeriods(companyId: string, limit?: number): Promise<PayrollPeriod[]> {
    return await (this.repository as PayrollPeriodRepository).getRecentPayrollPeriods(companyId, limit);
  }

  async getActivePayrollPeriods(companyId: string): Promise<PayrollPeriod[]> {
    return await (this.repository as PayrollPeriodRepository).getActivePayrollPeriods(companyId);
  }

  async getPayrollSummaryByMonth(companyId: string, year: number): Promise<any> {
    return await (this.repository as PayrollPeriodRepository).getPayrollSummaryByMonth(companyId, year);
  }

  async getEmployeePayrollSummary(payrollPeriodId: string, companyId: string): Promise<any> {
    await this.findByIdAndCompany(payrollPeriodId, companyId);
    return await this.payrollItemRepository.getEmployeePayrollSummary(payrollPeriodId);
  }

  async getPayrollItemStats(payrollPeriodId: string, companyId: string): Promise<any> {
    await this.findByIdAndCompany(payrollPeriodId, companyId);
    return await this.payrollItemRepository.getPayrollItemStats(payrollPeriodId);
  }

  async duplicateFromPreviousPeriod(payrollPeriodId: string, companyId: string, fromPayrollPeriodId: string): Promise<PayrollPeriod> {
    const payrollPeriod = await this.findByIdAndCompany(payrollPeriodId, companyId);
    const fromPayrollPeriod = await this.findByIdAndCompany(fromPayrollPeriodId, companyId);

    if (payrollPeriod.status !== PayrollStatus.RASCUNHO) {
      throw AppError.badRequest('Apenas períodos em rascunho podem receber itens duplicados');
    }

    // Duplicar itens do período anterior
    await this.payrollItemRepository.duplicateItemsFromPreviousPeriod(fromPayrollPeriodId, payrollPeriodId);

    // Atualizar totais
    await (this.repository as PayrollPeriodRepository).updateTotals(payrollPeriodId);

    return await this.findByIdAndCompany(payrollPeriodId, companyId);
  }

  async delete(payrollPeriodId: string, companyId: string): Promise<void> {
    const payrollPeriod = await this.findByIdAndCompany(payrollPeriodId, companyId);

    // Verificar se o período pode ser excluído
    const canDelete = await (this.repository as PayrollPeriodRepository).canDeletePayrollPeriod(payrollPeriodId);
    
    if (!canDelete) {
      throw AppError.badRequest('Não é possível excluir um período processado ou pago');
    }

    // Excluir itens relacionados
    await this.payrollItemRepository.deleteByPayrollPeriod(payrollPeriodId);

    // Excluir período
    await this.repository.delete(payrollPeriodId);
  }

  async validatePayrollPeriodData(data: CreatePayrollPeriodDto | UpdatePayrollPeriodDto): Promise<void> {
    // Validações adicionais de negócio
    
    if ('name' in data && data.name) {
      if (data.name.trim().length < 3) {
        throw AppError.badRequest('Nome do período deve ter pelo menos 3 caracteres');
      }

      if (data.name.trim().length > 100) {
        throw AppError.badRequest('Nome do período deve ter no máximo 100 caracteres');
      }
    }

    if ('period_start' in data && 'period_end' in data && data.period_start && data.period_end) {
      const startDate = new Date(data.period_start);
      const endDate = new Date(data.period_end);

      if (startDate >= endDate) {
        throw AppError.badRequest('Data de início deve ser anterior à data de fim');
      }

      // Verificar se o período não é muito longo (ex: máximo 3 meses)
      const diffInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffInDays > 93) { // ~3 meses
        throw AppError.badRequest('Período não pode ser superior a 3 meses');
      }
    }

    if ('payment_date' in data && data.payment_date) {
      const paymentDate = new Date(data.payment_date);
      const now = new Date();

      // Data de pagamento não pode ser muito no passado
      const diffInDays = (now.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffInDays > 365) {
        throw AppError.badRequest('Data de pagamento não pode ser superior a 1 ano no passado');
      }
    }
  }

  protected async beforeCreate(data: CreatePayrollPeriodDto): Promise<void> {
    await this.validatePayrollPeriodData(data);
  }

  protected async beforeUpdate(id: string | number, data: UpdatePayrollPeriodDto): Promise<void> {
    await this.validatePayrollPeriodData(data);
  }
}

