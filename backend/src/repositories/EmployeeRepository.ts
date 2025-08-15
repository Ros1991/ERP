import { BaseRepository } from './BaseRepository';
import { Employee } from '@/entities/Employee';
import { EmployeeFilterDto, ContractType, EmployeeStatus } from '@/dtos/EmployeeDto';
import { PaginatedResult } from '@/utils/PaginationFactory';
import { FindOptionsWhere, Between, MoreThanOrEqual, LessThanOrEqual, In } from 'typeorm';

export class EmployeeRepository extends BaseRepository<Employee> {
  constructor() {
    super(Employee);
  }

  async findByCompanyId(companyId: string): Promise<Employee[]> {
    return await this.getRepository()
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.company_member', 'company_member')
      .leftJoinAndSelect('company_member.user', 'user')
      .leftJoinAndSelect('company_member.role', 'role')
      .leftJoinAndSelect('employee.documents', 'documents')
      .where('employee.company_id = :companyId', { companyId })
      .orderBy('company_member.user.name', 'ASC')
      .getMany();
  }

  async findByIdWithDetails(id: string): Promise<Employee | null> {
    return await this.getRepository()
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.company_member', 'company_member')
      .leftJoinAndSelect('company_member.user', 'user')
      .leftJoinAndSelect('company_member.role', 'role')
      .leftJoinAndSelect('employee.documents', 'documents')
      .leftJoinAndSelect('documents.uploaded_by', 'uploaded_by')
      .leftJoinAndSelect('employee.ledger_entries', 'ledger_entries')
      .where('employee.id = :id', { id })
      .getOne();
  }

  async findByCompanyMemberId(companyMemberId: string): Promise<Employee | null> {
    return await this.findOne({ company_member_id: companyMemberId });
  }

  async findByCpf(cpf: string, companyId: string, excludeId?: string): Promise<Employee | null> {
    const query = this.getRepository()
      .createQueryBuilder('employee')
      .where('employee.cpf = :cpf', { cpf })
      .andWhere('employee.company_id = :companyId', { companyId });

    if (excludeId) {
      query.andWhere('employee.id != :excludeId', { excludeId });
    }

    return await query.getOne();
  }

  async cpfExists(cpf: string, companyId: string, excludeId?: string): Promise<boolean> {
    const employee = await this.findByCpf(cpf, companyId, excludeId);
    return !!employee;
  }

  async findWithFilters(companyId: string, filters: EmployeeFilterDto): Promise<PaginatedResult<Employee>> {
    const query = this.getRepository()
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.company_member', 'company_member')
      .leftJoinAndSelect('company_member.user', 'user')
      .leftJoinAndSelect('company_member.role', 'role')
      .where('employee.company_id = :companyId', { companyId });

    // Filtros de busca
    if (filters.search) {
      query.andWhere(
        '(LOWER(user.name) LIKE LOWER(:search) OR LOWER(employee.cpf) LIKE LOWER(:search) OR LOWER(employee.rg) LIKE LOWER(:search))',
        { search: `%${filters.search}%` }
      );
    }

    // Filtros específicos
    if (filters.contract_type) {
      query.andWhere('employee.contract_type = :contractType', { contractType: filters.contract_type });
    }

    if (filters.status) {
      query.andWhere('employee.status = :status', { status: filters.status });
    }

    if (filters.is_in_payroll !== undefined) {
      query.andWhere('employee.is_in_payroll = :isInPayroll', { isInPayroll: filters.is_in_payroll });
    }

    // Filtros de data de admissão
    if (filters.admission_date_start) {
      query.andWhere('employee.admission_date >= :admissionDateStart', { 
        admissionDateStart: new Date(filters.admission_date_start) 
      });
    }

    if (filters.admission_date_end) {
      query.andWhere('employee.admission_date <= :admissionDateEnd', { 
        admissionDateEnd: new Date(filters.admission_date_end) 
      });
    }

    // Filtros de salário
    if (filters.salary_min !== undefined) {
      query.andWhere('employee.salary >= :salaryMin', { salaryMin: filters.salary_min });
    }

    if (filters.salary_max !== undefined) {
      query.andWhere('employee.salary <= :salaryMax', { salaryMax: filters.salary_max });
    }

    // Filtros de data genéricos
    if (filters.startDate) {
      query.andWhere('employee.created_at >= :startDate', { startDate: filters.startDate });
    }

    if (filters.endDate) {
      query.andWhere('employee.created_at <= :endDate', { endDate: filters.endDate });
    }

    // Ordenação
    const sortBy = filters.sortBy || 'user.name';
    const sortOrder = filters.sortOrder || 'ASC';
    
    if (sortBy === 'name') {
      query.orderBy('user.name', sortOrder);
    } else if (sortBy === 'admission_date') {
      query.orderBy('employee.admission_date', sortOrder);
    } else if (sortBy === 'salary') {
      query.orderBy('employee.salary', sortOrder);
    } else {
      query.orderBy(`employee.${sortBy}`, sortOrder);
    }

    return await this.paginateQuery(query, {
      page: filters.page || 1,
      limit: filters.limit || 20
    });
  }

  async getEmployeeStats(companyId: string): Promise<{
    total_employees: number;
    active_employees: number;
    inactive_employees: number;
    employees_in_payroll: number;
    contract_type_distribution: Record<ContractType, number>;
    status_distribution: Record<EmployeeStatus, number>;
    average_salary: number;
    recent_hires: number;
    upcoming_contract_renewals: number;
  }> {
    const baseQuery = this.getRepository()
      .createQueryBuilder('employee')
      .where('employee.company_id = :companyId', { companyId });

    // Contadores básicos
    const total_employees = await baseQuery.getCount();
    
    const active_employees = await baseQuery
      .clone()
      .andWhere('employee.status = :status', { status: EmployeeStatus.ATIVO })
      .getCount();

    const inactive_employees = total_employees - active_employees;

    const employees_in_payroll = await baseQuery
      .clone()
      .andWhere('employee.is_in_payroll = :isInPayroll', { isInPayroll: true })
      .getCount();

    // Distribuição por tipo de contrato
    const contractTypeResults = await baseQuery
      .clone()
      .select('employee.contract_type', 'contract_type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('employee.contract_type')
      .getRawMany();

    const contract_type_distribution: Record<ContractType, number> = {
      [ContractType.CLT]: 0,
      [ContractType.PJ]: 0,
      [ContractType.FREELANCER]: 0,
      [ContractType.ESTAGIARIO]: 0,
      [ContractType.TERCEIRIZADO]: 0
    };

    contractTypeResults.forEach(result => {
      contract_type_distribution[result.contract_type as ContractType] = parseInt(result.count);
    });

    // Distribuição por status
    const statusResults = await baseQuery
      .clone()
      .select('employee.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('employee.status')
      .getRawMany();

    const status_distribution: Record<EmployeeStatus, number> = {
      [EmployeeStatus.ATIVO]: 0,
      [EmployeeStatus.INATIVO]: 0,
      [EmployeeStatus.AFASTADO]: 0,
      [EmployeeStatus.DEMITIDO]: 0,
      [EmployeeStatus.APOSENTADO]: 0
    };

    statusResults.forEach(result => {
      status_distribution[result.status as EmployeeStatus] = parseInt(result.count);
    });

    // Salário médio
    const salaryResult = await baseQuery
      .clone()
      .select('AVG(employee.salary)', 'average_salary')
      .where('employee.salary IS NOT NULL')
      .andWhere('employee.company_id = :companyId', { companyId })
      .getRawOne();

    const average_salary = parseFloat(salaryResult?.average_salary || '0');

    // Contratações recentes (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recent_hires = await baseQuery
      .clone()
      .andWhere('employee.admission_date >= :thirtyDaysAgo', { thirtyDaysAgo })
      .getCount();

    // Renovações de contrato próximas (próximos 30 dias)
    // Para contratos temporários que podem ter data de término
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const upcoming_contract_renewals = await baseQuery
      .clone()
      .andWhere('employee.termination_date IS NOT NULL')
      .andWhere('employee.termination_date <= :thirtyDaysFromNow', { thirtyDaysFromNow })
      .andWhere('employee.status = :status', { status: EmployeeStatus.ATIVO })
      .getCount();

    return {
      total_employees,
      active_employees,
      inactive_employees,
      employees_in_payroll,
      contract_type_distribution,
      status_distribution,
      average_salary,
      recent_hires,
      upcoming_contract_renewals
    };
  }

  async findByStatus(companyId: string, status: EmployeeStatus): Promise<Employee[]> {
    return await this.findMany({ company_id: companyId, status });
  }

  async findInPayroll(companyId: string): Promise<Employee[]> {
    return await this.findMany({ 
      company_id: companyId, 
      is_in_payroll: true,
      status: EmployeeStatus.ATIVO
    });
  }

  async bulkUpdateStatus(employeeIds: string[], status: EmployeeStatus): Promise<number> {
    const result = await this.getRepository()
      .createQueryBuilder()
      .update(Employee)
      .set({ status })
      .where('id IN (:...employeeIds)', { employeeIds })
      .execute();

    return result.affected ?? 0;
  }

  async togglePayrollStatus(employeeId: string, isInPayroll: boolean): Promise<boolean> {
    const result = await this.getRepository()
      .createQueryBuilder()
      .update(Employee)
      .set({ is_in_payroll: isInPayroll })
      .where('id = :employeeId', { employeeId })
      .execute();

    return (result.affected ?? 0) > 0;
  }

  async findEmployeesWithUpcomingBirthdays(companyId: string, days: number = 30): Promise<Employee[]> {
    // Esta query é mais complexa pois precisa comparar apenas mês e dia
    return await this.getRepository()
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.company_member', 'company_member')
      .leftJoinAndSelect('company_member.user', 'user')
      .where('employee.company_id = :companyId', { companyId })
      .andWhere('employee.status = :status', { status: EmployeeStatus.ATIVO })
      .andWhere(`
        (EXTRACT(MONTH FROM employee.birth_date) = EXTRACT(MONTH FROM CURRENT_DATE) 
         AND EXTRACT(DAY FROM employee.birth_date) >= EXTRACT(DAY FROM CURRENT_DATE))
        OR
        (EXTRACT(MONTH FROM employee.birth_date) = EXTRACT(MONTH FROM CURRENT_DATE + INTERVAL '${days} days')
         AND EXTRACT(DAY FROM employee.birth_date) <= EXTRACT(DAY FROM CURRENT_DATE + INTERVAL '${days} days'))
      `)
      .orderBy('EXTRACT(MONTH FROM employee.birth_date)', 'ASC')
      .addOrderBy('EXTRACT(DAY FROM employee.birth_date)', 'ASC')
      .getMany();
  }

  async findEmployeesWithDocumentExpiration(companyId: string, days: number = 30): Promise<Employee[]> {
    // Esta funcionalidade seria implementada quando tivermos documentos com data de expiração
    // Por enquanto, retornamos array vazio
    return [];
  }

  async getEmployeesByRole(companyId: string, roleId: string): Promise<Employee[]> {
    return await this.getRepository()
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.company_member', 'company_member')
      .leftJoinAndSelect('company_member.user', 'user')
      .leftJoinAndSelect('company_member.role', 'role')
      .where('employee.company_id = :companyId', { companyId })
      .andWhere('company_member.role_id = :roleId', { roleId })
      .orderBy('user.name', 'ASC')
      .getMany();
  }

  async searchEmployees(companyId: string, searchTerm: string): Promise<Employee[]> {
    return await this.getRepository()
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.company_member', 'company_member')
      .leftJoinAndSelect('company_member.user', 'user')
      .leftJoinAndSelect('company_member.role', 'role')
      .where('employee.company_id = :companyId', { companyId })
      .andWhere(`(
        LOWER(user.name) LIKE LOWER(:searchTerm) OR
        LOWER(employee.cpf) LIKE LOWER(:searchTerm) OR
        LOWER(employee.rg) LIKE LOWER(:searchTerm) OR
        LOWER(user.email) LIKE LOWER(:searchTerm)
      )`, { searchTerm: `%${searchTerm}%` })
      .orderBy('user.name', 'ASC')
      .limit(50)
      .getMany();
  }
}

