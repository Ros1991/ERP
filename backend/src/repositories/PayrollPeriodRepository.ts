import { BaseRepository } from './BaseRepository';
import { PayrollPeriod } from '@/entities/PayrollPeriod';
import { PayrollFilterDto, PayrollStatus, PayrollPeriodType } from '@/dtos/PayrollDto';
import { PaginatedResult } from '@/utils/PaginationFactory';

export class PayrollPeriodRepository extends BaseRepository<PayrollPeriod> {
  constructor() {
    super(PayrollPeriod);
  }

  async findByCompanyId(companyId: string): Promise<PayrollPeriod[]> {
    return await this.getRepository()
      .createQueryBuilder('payroll_period')
      .leftJoinAndSelect('payroll_period.processed_by_user', 'processed_by_user')
      .where('payroll_period.company_id = :companyId', { companyId })
      .orderBy('payroll_period.period_start', 'DESC')
      .getMany();
  }

  async findByIdWithDetails(id: string): Promise<PayrollPeriod | null> {
    return await this.getRepository()
      .createQueryBuilder('payroll_period')
      .leftJoinAndSelect('payroll_period.processed_by_user', 'processed_by_user')
      .leftJoinAndSelect('payroll_period.payroll_items', 'payroll_items')
      .leftJoinAndSelect('payroll_items.employee', 'employee')
      .leftJoinAndSelect('employee.company_member', 'company_member')
      .leftJoinAndSelect('company_member.user', 'user')
      .where('payroll_period.id = :id', { id })
      .getOne();
  }

  async findWithFilters(companyId: string, filters: PayrollFilterDto): Promise<PaginatedResult<PayrollPeriod>> {
    const query = this.getRepository()
      .createQueryBuilder('payroll_period')
      .leftJoinAndSelect('payroll_period.processed_by_user', 'processed_by_user')
      .where('payroll_period.company_id = :companyId', { companyId });

    // Filtros de busca
    if (filters.search) {
      query.andWhere(
        '(LOWER(payroll_period.name) LIKE LOWER(:search) OR LOWER(payroll_period.description) LIKE LOWER(:search))',
        { search: `%${filters.search}%` }
      );
    }

    // Filtros específicos
    if (filters.status) {
      query.andWhere('payroll_period.status = :status', { status: filters.status });
    }

    if (filters.period_type) {
      query.andWhere('payroll_period.period_type = :periodType', { periodType: filters.period_type });
    }

    // Filtros de período
    if (filters.period_start) {
      query.andWhere('payroll_period.period_start >= :periodStart', { 
        periodStart: new Date(filters.period_start) 
      });
    }

    if (filters.period_end) {
      query.andWhere('payroll_period.period_end <= :periodEnd', { 
        periodEnd: new Date(filters.period_end) 
      });
    }

    // Filtros de data de pagamento
    if (filters.payment_date_start) {
      query.andWhere('payroll_period.payment_date >= :paymentDateStart', { 
        paymentDateStart: new Date(filters.payment_date_start) 
      });
    }

    if (filters.payment_date_end) {
      query.andWhere('payroll_period.payment_date <= :paymentDateEnd', { 
        paymentDateEnd: new Date(filters.payment_date_end) 
      });
    }

    // Filtros de data genéricos
    if (filters.startDate) {
      query.andWhere('payroll_period.created_at >= :startDate', { startDate: filters.startDate });
    }

    if (filters.endDate) {
      query.andWhere('payroll_period.created_at <= :endDate', { endDate: filters.endDate });
    }

    // Ordenação
    const sortBy = filters.sortBy || 'period_start';
    const sortOrder = filters.sortOrder || 'DESC';
    
    query.orderBy(`payroll_period.${sortBy}`, sortOrder);

    return await this.paginateQuery(query, {
      page: filters.page || 1,
      limit: filters.limit || 20
    });
  }

  async getPayrollPeriodStats(companyId: string): Promise<{
    total_periods: number;
    draft_periods: number;
    processing_periods: number;
    processed_periods: number;
    paid_periods: number;
    cancelled_periods: number;
    periods_by_status: Record<PayrollStatus, number>;
    periods_by_type: Record<PayrollPeriodType, number>;
    current_month_total: number;
    average_period_value: number;
    total_employees_in_payroll: number;
    recent_periods: number;
  }> {
    const baseQuery = this.getRepository()
      .createQueryBuilder('payroll_period')
      .where('payroll_period.company_id = :companyId', { companyId });

    // Contadores básicos
    const total_periods = await baseQuery.getCount();
    
    const draft_periods = await baseQuery
      .clone()
      .andWhere('payroll_period.status = :status', { status: PayrollStatus.RASCUNHO })
      .getCount();

    const processing_periods = await baseQuery
      .clone()
      .andWhere('payroll_period.status = :status', { status: PayrollStatus.EM_PROCESSAMENTO })
      .getCount();

    const processed_periods = await baseQuery
      .clone()
      .andWhere('payroll_period.status = :status', { status: PayrollStatus.PROCESSADA })
      .getCount();

    const paid_periods = await baseQuery
      .clone()
      .andWhere('payroll_period.status = :status', { status: PayrollStatus.PAGA })
      .getCount();

    const cancelled_periods = await baseQuery
      .clone()
      .andWhere('payroll_period.status = :status', { status: PayrollStatus.CANCELADA })
      .getCount();

    // Distribuição por status
    const statusResults = await baseQuery
      .clone()
      .select('payroll_period.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('payroll_period.status')
      .getRawMany();

    const periods_by_status: Record<PayrollStatus, number> = {
      [PayrollStatus.RASCUNHO]: 0,
      [PayrollStatus.EM_PROCESSAMENTO]: 0,
      [PayrollStatus.PROCESSADA]: 0,
      [PayrollStatus.PAGA]: 0,
      [PayrollStatus.CANCELADA]: 0
    };

    statusResults.forEach(result => {
      periods_by_status[result.status as PayrollStatus] = parseInt(result.count);
    });

    // Distribuição por tipo
    const typeResults = await baseQuery
      .clone()
      .select('payroll_period.period_type', 'period_type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('payroll_period.period_type')
      .getRawMany();

    const periods_by_type: Record<PayrollPeriodType, number> = {
      [PayrollPeriodType.MENSAL]: 0,
      [PayrollPeriodType.QUINZENAL]: 0,
      [PayrollPeriodType.SEMANAL]: 0
    };

    typeResults.forEach(result => {
      periods_by_type[result.period_type as PayrollPeriodType] = parseInt(result.count);
    });

    // Total do mês atual
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const currentMonthResult = await baseQuery
      .clone()
      .andWhere('payroll_period.period_start >= :currentMonth', { currentMonth })
      .andWhere('payroll_period.period_start < :nextMonth', { nextMonth })
      .select('SUM(payroll_period.total_net)', 'current_month_total')
      .getRawOne();

    const current_month_total = parseFloat(currentMonthResult?.current_month_total || '0');

    // Valor médio por período
    const averageResult = await baseQuery
      .clone()
      .andWhere('payroll_period.status != :cancelledStatus', { cancelledStatus: PayrollStatus.CANCELADA })
      .select('AVG(payroll_period.total_net)', 'average_value')
      .getRawOne();

    const average_period_value = parseFloat(averageResult?.average_value || '0');

    // Total de funcionários na folha
    const employeeCountResult = await this.getRepository()
      .createQueryBuilder('payroll_period')
      .leftJoin('payroll_period.payroll_items', 'payroll_item')
      .where('payroll_period.company_id = :companyId', { companyId })
      .andWhere('payroll_period.status != :cancelledStatus', { cancelledStatus: PayrollStatus.CANCELADA })
      .select('COUNT(DISTINCT payroll_item.employee_id)', 'employee_count')
      .getRawOne();

    const total_employees_in_payroll = parseInt(employeeCountResult?.employee_count || '0');

    // Períodos recentes (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recent_periods = await baseQuery
      .clone()
      .andWhere('payroll_period.created_at >= :thirtyDaysAgo', { thirtyDaysAgo })
      .getCount();

    return {
      total_periods,
      draft_periods,
      processing_periods,
      processed_periods,
      paid_periods,
      cancelled_periods,
      periods_by_status,
      periods_by_type,
      current_month_total,
      average_period_value,
      total_employees_in_payroll,
      recent_periods
    };
  }

  async findByStatus(companyId: string, status: PayrollStatus): Promise<PayrollPeriod[]> {
    return await this.findMany({ company_id: companyId, status });
  }

  async findByPeriodType(companyId: string, periodType: PayrollPeriodType): Promise<PayrollPeriod[]> {
    return await this.findMany({ company_id: companyId, period_type: periodType });
  }

  async findByDateRange(companyId: string, startDate: Date, endDate: Date): Promise<PayrollPeriod[]> {
    return await this.getRepository()
      .createQueryBuilder('payroll_period')
      .leftJoinAndSelect('payroll_period.processed_by_user', 'processed_by_user')
      .where('payroll_period.company_id = :companyId', { companyId })
      .andWhere('payroll_period.period_start >= :startDate', { startDate })
      .andWhere('payroll_period.period_end <= :endDate', { endDate })
      .orderBy('payroll_period.period_start', 'DESC')
      .getMany();
  }

  async findOverlappingPeriods(companyId: string, startDate: Date, endDate: Date, excludeId?: string): Promise<PayrollPeriod[]> {
    const query = this.getRepository()
      .createQueryBuilder('payroll_period')
      .where('payroll_period.company_id = :companyId', { companyId })
      .andWhere(`(
        (payroll_period.period_start <= :startDate AND payroll_period.period_end >= :startDate) OR
        (payroll_period.period_start <= :endDate AND payroll_period.period_end >= :endDate) OR
        (payroll_period.period_start >= :startDate AND payroll_period.period_end <= :endDate)
      )`, { startDate, endDate });

    if (excludeId) {
      query.andWhere('payroll_period.id != :excludeId', { excludeId });
    }

    return await query.getMany();
  }

  async updateTotals(periodId: string): Promise<boolean> {
    const totalsResult = await this.getRepository()
      .createQueryBuilder('payroll_period')
      .leftJoin('payroll_period.payroll_items', 'payroll_item')
      .where('payroll_period.id = :periodId', { periodId })
      .select([
        'SUM(CASE WHEN payroll_item.calculated_value > 0 THEN payroll_item.calculated_value ELSE 0 END) as total_gross',
        'SUM(CASE WHEN payroll_item.calculated_value < 0 THEN ABS(payroll_item.calculated_value) ELSE 0 END) as total_deductions'
      ])
      .getRawOne();

    const totalGross = parseFloat(totalsResult?.total_gross || '0');
    const totalDeductions = parseFloat(totalsResult?.total_deductions || '0');
    const totalNet = totalGross - totalDeductions;

    const result = await this.getRepository()
      .createQueryBuilder()
      .update(PayrollPeriod)
      .set({
        total_gross: totalGross,
        total_deductions: totalDeductions,
        total_net: totalNet
      })
      .where('id = :periodId', { periodId })
      .execute();

    return (result.affected ?? 0) > 0;
  }

  async markAsProcessed(periodId: string, processedByUserId: string): Promise<boolean> {
    const result = await this.getRepository()
      .createQueryBuilder()
      .update(PayrollPeriod)
      .set({
        status: PayrollStatus.PROCESSADA,
        processed_at: new Date(),
        processed_by_user_id: processedByUserId
      })
      .where('id = :periodId', { periodId })
      .execute();

    return (result.affected ?? 0) > 0;
  }

  async markAsPaid(periodId: string): Promise<boolean> {
    const result = await this.getRepository()
      .createQueryBuilder()
      .update(PayrollPeriod)
      .set({ status: PayrollStatus.PAGA })
      .where('id = :periodId', { periodId })
      .execute();

    return (result.affected ?? 0) > 0;
  }

  async searchPayrollPeriods(companyId: string, searchTerm: string): Promise<PayrollPeriod[]> {
    return await this.getRepository()
      .createQueryBuilder('payroll_period')
      .leftJoinAndSelect('payroll_period.processed_by_user', 'processed_by_user')
      .where('payroll_period.company_id = :companyId', { companyId })
      .andWhere(`(
        LOWER(payroll_period.name) LIKE LOWER(:searchTerm) OR
        LOWER(payroll_period.description) LIKE LOWER(:searchTerm)
      )`, { searchTerm: `%${searchTerm}%` })
      .orderBy('payroll_period.period_start', 'DESC')
      .limit(50)
      .getMany();
  }

  async getRecentPayrollPeriods(companyId: string, limit: number = 10): Promise<PayrollPeriod[]> {
    return await this.getRepository()
      .createQueryBuilder('payroll_period')
      .leftJoinAndSelect('payroll_period.processed_by_user', 'processed_by_user')
      .where('payroll_period.company_id = :companyId', { companyId })
      .orderBy('payroll_period.created_at', 'DESC')
      .limit(limit)
      .getMany();
  }

  async getActivePayrollPeriods(companyId: string): Promise<PayrollPeriod[]> {
    return await this.getRepository()
      .createQueryBuilder('payroll_period')
      .leftJoinAndSelect('payroll_period.processed_by_user', 'processed_by_user')
      .where('payroll_period.company_id = :companyId', { companyId })
      .andWhere('payroll_period.status IN (:...activeStatuses)', { 
        activeStatuses: [PayrollStatus.RASCUNHO, PayrollStatus.EM_PROCESSAMENTO, PayrollStatus.PROCESSADA] 
      })
      .orderBy('payroll_period.period_start', 'DESC')
      .getMany();
  }

  async getPayrollSummaryByMonth(companyId: string, year: number): Promise<Array<{
    month: number;
    period_count: number;
    total_gross: number;
    total_deductions: number;
    total_net: number;
    employee_count: number;
  }>> {
    const results = await this.getRepository()
      .createQueryBuilder('payroll_period')
      .leftJoin('payroll_period.payroll_items', 'payroll_item')
      .where('payroll_period.company_id = :companyId', { companyId })
      .andWhere('EXTRACT(YEAR FROM payroll_period.period_start) = :year', { year })
      .andWhere('payroll_period.status != :cancelledStatus', { cancelledStatus: PayrollStatus.CANCELADA })
      .select([
        'EXTRACT(MONTH FROM payroll_period.period_start) as month',
        'COUNT(DISTINCT payroll_period.id) as period_count',
        'SUM(payroll_period.total_gross) as total_gross',
        'SUM(payroll_period.total_deductions) as total_deductions',
        'SUM(payroll_period.total_net) as total_net',
        'COUNT(DISTINCT payroll_item.employee_id) as employee_count'
      ])
      .groupBy('EXTRACT(MONTH FROM payroll_period.period_start)')
      .orderBy('month', 'ASC')
      .getRawMany();

    return results.map(result => ({
      month: parseInt(result.month),
      period_count: parseInt(result.period_count) || 0,
      total_gross: parseFloat(result.total_gross) || 0,
      total_deductions: parseFloat(result.total_deductions) || 0,
      total_net: parseFloat(result.total_net) || 0,
      employee_count: parseInt(result.employee_count) || 0
    }));
  }

  async canDeletePayrollPeriod(periodId: string): Promise<boolean> {
    const period = await this.getRepository()
      .createQueryBuilder('payroll_period')
      .leftJoinAndSelect('payroll_period.payroll_items', 'payroll_items')
      .where('payroll_period.id = :periodId', { periodId })
      .getOne();

    if (!period) {
      return false;
    }

    // Não pode excluir períodos processados ou pagos
    if (period.status === PayrollStatus.PROCESSADA || period.status === PayrollStatus.PAGA) {
      return false;
    }

    return true;
  }
}

