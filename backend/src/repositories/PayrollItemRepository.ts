import { BaseRepository } from './BaseRepository';
import { PayrollItem } from '@/entities/PayrollItem';
import { PayrollItemType, PayrollCalculationType } from '@/dtos/PayrollDto';

export class PayrollItemRepository extends BaseRepository<PayrollItem> {
  constructor() {
    super(PayrollItem);
  }

  async findByPayrollPeriodId(payrollPeriodId: string): Promise<PayrollItem[]> {
    return await this.getRepository()
      .createQueryBuilder('payroll_item')
      .leftJoinAndSelect('payroll_item.employee', 'employee')
      .leftJoinAndSelect('employee.company_member', 'company_member')
      .leftJoinAndSelect('company_member.user', 'user')
      .where('payroll_item.payroll_period_id = :payrollPeriodId', { payrollPeriodId })
      .orderBy('user.name', 'ASC')
      .addOrderBy('payroll_item.item_type', 'ASC')
      .getMany();
  }

  async findByEmployeeId(employeeId: string): Promise<PayrollItem[]> {
    return await this.getRepository()
      .createQueryBuilder('payroll_item')
      .leftJoinAndSelect('payroll_item.payroll_period', 'payroll_period')
      .where('payroll_item.employee_id = :employeeId', { employeeId })
      .orderBy('payroll_period.period_start', 'DESC')
      .addOrderBy('payroll_item.item_type', 'ASC')
      .getMany();
  }

  async findByPayrollPeriodAndEmployee(payrollPeriodId: string, employeeId: string): Promise<PayrollItem[]> {
    return await this.getRepository()
      .createQueryBuilder('payroll_item')
      .where('payroll_item.payroll_period_id = :payrollPeriodId', { payrollPeriodId })
      .andWhere('payroll_item.employee_id = :employeeId', { employeeId })
      .orderBy('payroll_item.item_type', 'ASC')
      .getMany();
  }

  async findByItemType(payrollPeriodId: string, itemType: PayrollItemType): Promise<PayrollItem[]> {
    return await this.getRepository()
      .createQueryBuilder('payroll_item')
      .leftJoinAndSelect('payroll_item.employee', 'employee')
      .leftJoinAndSelect('employee.company_member', 'company_member')
      .leftJoinAndSelect('company_member.user', 'user')
      .where('payroll_item.payroll_period_id = :payrollPeriodId', { payrollPeriodId })
      .andWhere('payroll_item.item_type = :itemType', { itemType })
      .orderBy('user.name', 'ASC')
      .getMany();
  }

  async getTotalByEmployee(payrollPeriodId: string, employeeId: string): Promise<{
    total_gross: number;
    total_deductions: number;
    total_net: number;
  }> {
    const result = await this.getRepository()
      .createQueryBuilder('payroll_item')
      .where('payroll_item.payroll_period_id = :payrollPeriodId', { payrollPeriodId })
      .andWhere('payroll_item.employee_id = :employeeId', { employeeId })
      .select([
        'SUM(CASE WHEN payroll_item.calculated_value > 0 THEN payroll_item.calculated_value ELSE 0 END) as total_gross',
        'SUM(CASE WHEN payroll_item.calculated_value < 0 THEN ABS(payroll_item.calculated_value) ELSE 0 END) as total_deductions'
      ])
      .getRawOne();

    const total_gross = parseFloat(result?.total_gross || '0');
    const total_deductions = parseFloat(result?.total_deductions || '0');
    const total_net = total_gross - total_deductions;

    return {
      total_gross,
      total_deductions,
      total_net
    };
  }

  async getTotalByItemType(payrollPeriodId: string): Promise<Array<{
    item_type: PayrollItemType;
    total_value: number;
    item_count: number;
    employee_count: number;
  }>> {
    const results = await this.getRepository()
      .createQueryBuilder('payroll_item')
      .where('payroll_item.payroll_period_id = :payrollPeriodId', { payrollPeriodId })
      .select([
        'payroll_item.item_type as item_type',
        'SUM(payroll_item.calculated_value) as total_value',
        'COUNT(payroll_item.id) as item_count',
        'COUNT(DISTINCT payroll_item.employee_id) as employee_count'
      ])
      .groupBy('payroll_item.item_type')
      .orderBy('total_value', 'DESC')
      .getRawMany();

    return results.map(result => ({
      item_type: result.item_type as PayrollItemType,
      total_value: parseFloat(result.total_value) || 0,
      item_count: parseInt(result.item_count) || 0,
      employee_count: parseInt(result.employee_count) || 0
    }));
  }

  async getEmployeePayrollSummary(payrollPeriodId: string): Promise<Array<{
    employee_id: string;
    employee_name: string;
    employee_email: string;
    total_gross: number;
    total_deductions: number;
    total_net: number;
    item_count: number;
  }>> {
    const results = await this.getRepository()
      .createQueryBuilder('payroll_item')
      .leftJoin('payroll_item.employee', 'employee')
      .leftJoin('employee.company_member', 'company_member')
      .leftJoin('company_member.user', 'user')
      .where('payroll_item.payroll_period_id = :payrollPeriodId', { payrollPeriodId })
      .select([
        'employee.id as employee_id',
        'user.name as employee_name',
        'user.email as employee_email',
        'SUM(CASE WHEN payroll_item.calculated_value > 0 THEN payroll_item.calculated_value ELSE 0 END) as total_gross',
        'SUM(CASE WHEN payroll_item.calculated_value < 0 THEN ABS(payroll_item.calculated_value) ELSE 0 END) as total_deductions',
        'COUNT(payroll_item.id) as item_count'
      ])
      .groupBy('employee.id')
      .orderBy('user.name', 'ASC')
      .getRawMany();

    return results.map(result => ({
      employee_id: result.employee_id,
      employee_name: result.employee_name,
      employee_email: result.employee_email,
      total_gross: parseFloat(result.total_gross) || 0,
      total_deductions: parseFloat(result.total_deductions) || 0,
      total_net: (parseFloat(result.total_gross) || 0) - (parseFloat(result.total_deductions) || 0),
      item_count: parseInt(result.item_count) || 0
    }));
  }

  async bulkCreateItems(items: Array<{
    payroll_period_id: string;
    employee_id: string;
    item_type: PayrollItemType;
    description: string;
    calculation_type: PayrollCalculationType;
    base_value?: number;
    calculated_value: number;
    legal_reference?: string;
    notes?: string;
  }>): Promise<PayrollItem[]> {
    const entities = items.map(item => this.getRepository().create(item));
    return await this.getRepository().save(entities);
  }

  async deleteByPayrollPeriod(payrollPeriodId: string): Promise<number> {
    const result = await this.getRepository()
      .createQueryBuilder()
      .delete()
      .from(PayrollItem)
      .where('payroll_period_id = :payrollPeriodId', { payrollPeriodId })
      .execute();

    return result.affected ?? 0;
  }

  async deleteByEmployee(payrollPeriodId: string, employeeId: string): Promise<number> {
    const result = await this.getRepository()
      .createQueryBuilder()
      .delete()
      .from(PayrollItem)
      .where('payroll_period_id = :payrollPeriodId', { payrollPeriodId })
      .andWhere('employee_id = :employeeId', { employeeId })
      .execute();

    return result.affected ?? 0;
  }

  async getItemsByCalculationType(payrollPeriodId: string, calculationType: PayrollCalculationType): Promise<PayrollItem[]> {
    return await this.getRepository()
      .createQueryBuilder('payroll_item')
      .leftJoinAndSelect('payroll_item.employee', 'employee')
      .leftJoinAndSelect('employee.company_member', 'company_member')
      .leftJoinAndSelect('company_member.user', 'user')
      .where('payroll_item.payroll_period_id = :payrollPeriodId', { payrollPeriodId })
      .andWhere('payroll_item.calculation_type = :calculationType', { calculationType })
      .orderBy('user.name', 'ASC')
      .addOrderBy('payroll_item.item_type', 'ASC')
      .getMany();
  }

  async getPayrollItemStats(payrollPeriodId: string): Promise<{
    total_items: number;
    total_employees: number;
    total_gross: number;
    total_deductions: number;
    total_net: number;
    items_by_type: Record<PayrollItemType, number>;
    items_by_calculation_type: Record<PayrollCalculationType, number>;
    average_gross_per_employee: number;
    average_net_per_employee: number;
  }> {
    const baseQuery = this.getRepository()
      .createQueryBuilder('payroll_item')
      .where('payroll_item.payroll_period_id = :payrollPeriodId', { payrollPeriodId });

    // Contadores básicos
    const total_items = await baseQuery.getCount();
    
    const employeeCountResult = await baseQuery
      .clone()
      .select('COUNT(DISTINCT payroll_item.employee_id)', 'employee_count')
      .getRawOne();

    const total_employees = parseInt(employeeCountResult?.employee_count || '0');

    // Totais financeiros
    const totalsResult = await baseQuery
      .clone()
      .select([
        'SUM(CASE WHEN payroll_item.calculated_value > 0 THEN payroll_item.calculated_value ELSE 0 END) as total_gross',
        'SUM(CASE WHEN payroll_item.calculated_value < 0 THEN ABS(payroll_item.calculated_value) ELSE 0 END) as total_deductions'
      ])
      .getRawOne();

    const total_gross = parseFloat(totalsResult?.total_gross || '0');
    const total_deductions = parseFloat(totalsResult?.total_deductions || '0');
    const total_net = total_gross - total_deductions;

    // Distribuição por tipo de item
    const typeResults = await baseQuery
      .clone()
      .select('payroll_item.item_type', 'item_type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('payroll_item.item_type')
      .getRawMany();

    const items_by_type: Record<PayrollItemType, number> = {
      [PayrollItemType.SALARIO_BASE]: 0,
      [PayrollItemType.HORAS_EXTRAS]: 0,
      [PayrollItemType.ADICIONAL_NOTURNO]: 0,
      [PayrollItemType.COMISSAO]: 0,
      [PayrollItemType.BONUS]: 0,
      [PayrollItemType.VALE_TRANSPORTE]: 0,
      [PayrollItemType.VALE_REFEICAO]: 0,
      [PayrollItemType.PLANO_SAUDE]: 0,
      [PayrollItemType.INSS]: 0,
      [PayrollItemType.IRRF]: 0,
      [PayrollItemType.FGTS]: 0,
      [PayrollItemType.DESCONTO_ATRASO]: 0,
      [PayrollItemType.DESCONTO_FALTA]: 0,
      [PayrollItemType.OUTROS_PROVENTOS]: 0,
      [PayrollItemType.OUTROS_DESCONTOS]: 0
    };

    typeResults.forEach(result => {
      items_by_type[result.item_type as PayrollItemType] = parseInt(result.count);
    });

    // Distribuição por tipo de cálculo
    const calculationResults = await baseQuery
      .clone()
      .select('payroll_item.calculation_type', 'calculation_type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('payroll_item.calculation_type')
      .getRawMany();

    const items_by_calculation_type: Record<PayrollCalculationType, number> = {
      [PayrollCalculationType.FIXO]: 0,
      [PayrollCalculationType.PERCENTUAL]: 0,
      [PayrollCalculationType.HORAS]: 0,
      [PayrollCalculationType.CALCULADO]: 0
    };

    calculationResults.forEach(result => {
      items_by_calculation_type[result.calculation_type as PayrollCalculationType] = parseInt(result.count);
    });

    // Médias por funcionário
    const average_gross_per_employee = total_employees > 0 ? total_gross / total_employees : 0;
    const average_net_per_employee = total_employees > 0 ? total_net / total_employees : 0;

    return {
      total_items,
      total_employees,
      total_gross,
      total_deductions,
      total_net,
      items_by_type,
      items_by_calculation_type,
      average_gross_per_employee,
      average_net_per_employee
    };
  }

  async getEmployeePayrollHistory(employeeId: string, limit: number = 12): Promise<Array<{
    payroll_period_id: string;
    period_name: string;
    period_start: Date;
    period_end: Date;
    total_gross: number;
    total_deductions: number;
    total_net: number;
    item_count: number;
  }>> {
    const results = await this.getRepository()
      .createQueryBuilder('payroll_item')
      .leftJoin('payroll_item.payroll_period', 'payroll_period')
      .where('payroll_item.employee_id = :employeeId', { employeeId })
      .select([
        'payroll_period.id as payroll_period_id',
        'payroll_period.name as period_name',
        'payroll_period.period_start as period_start',
        'payroll_period.period_end as period_end',
        'SUM(CASE WHEN payroll_item.calculated_value > 0 THEN payroll_item.calculated_value ELSE 0 END) as total_gross',
        'SUM(CASE WHEN payroll_item.calculated_value < 0 THEN ABS(payroll_item.calculated_value) ELSE 0 END) as total_deductions',
        'COUNT(payroll_item.id) as item_count'
      ])
      .groupBy('payroll_period.id')
      .orderBy('payroll_period.period_start', 'DESC')
      .limit(limit)
      .getRawMany();

    return results.map(result => ({
      payroll_period_id: result.payroll_period_id,
      period_name: result.period_name,
      period_start: result.period_start,
      period_end: result.period_end,
      total_gross: parseFloat(result.total_gross) || 0,
      total_deductions: parseFloat(result.total_deductions) || 0,
      total_net: (parseFloat(result.total_gross) || 0) - (parseFloat(result.total_deductions) || 0),
      item_count: parseInt(result.item_count) || 0
    }));
  }

  async duplicateItemsFromPreviousPeriod(
    fromPayrollPeriodId: string, 
    toPayrollPeriodId: string, 
    employeeIds?: string[]
  ): Promise<PayrollItem[]> {
    let query = this.getRepository()
      .createQueryBuilder('payroll_item')
      .where('payroll_item.payroll_period_id = :fromPayrollPeriodId', { fromPayrollPeriodId });

    if (employeeIds && employeeIds.length > 0) {
      query = query.andWhere('payroll_item.employee_id IN (:...employeeIds)', { employeeIds });
    }

    const existingItems = await query.getMany();

    const newItems = existingItems.map(item => ({
      payroll_period_id: toPayrollPeriodId,
      employee_id: item.employee_id,
      item_type: item.item_type,
      description: item.description,
      calculation_type: item.calculation_type,
      base_value: item.base_value,
      calculated_value: item.calculated_value,
      legal_reference: item.legal_reference,
      notes: item.notes
    }));

    return await this.bulkCreateItems(newItems);
  }

  async recalculateItems(payrollPeriodId: string, employeeId?: string): Promise<number> {
    // Esta função seria implementada com as regras específicas de cálculo da folha
    // Por enquanto, retorna 0 indicando que nenhum item foi recalculado
    // Em uma implementação real, aqui seria onde as regras de negócio de cálculo seriam aplicadas
    
    let query = this.getRepository()
      .createQueryBuilder()
      .update(PayrollItem)
      .where('payroll_period_id = :payrollPeriodId', { payrollPeriodId });

    if (employeeId) {
      query = query.andWhere('employee_id = :employeeId', { employeeId });
    }

    // Exemplo de recálculo simples - em produção seria mais complexo
    const result = await query
      .set({ 
        calculated_value: () => 'CASE WHEN base_value IS NOT NULL THEN base_value ELSE calculated_value END'
      })
      .execute();

    return result.affected ?? 0;
  }
}

