import { BaseService } from './BaseService';
import { Employee } from '../entities/Employee';
import { EmployeeRepository } from '../repositories/EmployeeRepository';
import { CompanyMemberRepository } from '../repositories/CompanyMemberRepository';
import { EmployeeDocumentRepository } from '../repositories/EmployeeDocumentRepository';
import { AppError } from '../utils/AppError';
import { 
  CreateEmployeeDto, 
  UpdateEmployeeDto, 
  EmployeeFilterDto,
  EmployeeResponseDto,
  EmployeeStatsDto,
  BulkUpdateEmployeeStatusDto,
  EmployeePayrollToggleDto,
  ContractType,
  EmployeeStatus
} from '../dtos/EmployeeDto';
import { PaginatedResult } from '../utils/PaginationFactory';

export class EmployeeService extends BaseService<Employee, CreateEmployeeDto, UpdateEmployeeDto> {
  private companyMemberRepository: CompanyMemberRepository;
  private employeeDocumentRepository: EmployeeDocumentRepository;

  constructor() {
    const employeeRepository = new EmployeeRepository();
    super(employeeRepository);
    this.companyMemberRepository = new CompanyMemberRepository();
    this.employeeDocumentRepository = new EmployeeDocumentRepository();
  }

  async create(companyId: string, data: CreateEmployeeDto): Promise<Employee> {
    // Verificar se o membro da empresa existe
    const companyMember = await this.companyMemberRepository.findByIdAndCompany(
      data.company_member_id, 
      companyId
    );
    
    if (!companyMember) {
      throw AppError.notFound('Membro da empresa não encontrado');
    }

    // Verificar se já existe um funcionário para este membro
    const existingEmployee = await (this.repository as EmployeeRepository)
      .findByCompanyMemberId(data.company_member_id);
    
    if (existingEmployee) {
      throw AppError.conflict('Já existe um funcionário cadastrado para este membro da empresa');
    }

    // Verificar se o CPF já está em uso na empresa
    const cpfExists = await (this.repository as EmployeeRepository)
      .cpfExists(data.cpf, companyId);
    
    if (cpfExists) {
      throw AppError.conflict('CPF já está em uso por outro funcionário');
    }

    // Validar datas
    const admissionDate = new Date(data.admission_date);
    const birthDate = new Date(data.birth_date);
    
    if (admissionDate < birthDate) {
      throw AppError.badRequest('Data de admissão não pode ser anterior à data de nascimento');
    }

    if (data.termination_date) {
      const terminationDate = new Date(data.termination_date);
      if (terminationDate < admissionDate) {
        throw AppError.badRequest('Data de demissão não pode ser anterior à data de admissão');
      }
    }

    // Criar funcionário
    const employeeData = {
      company_id: companyId,
      company_member_id: data.company_member_id,
      cpf: data.cpf,
      rg: data.rg,
      birth_date: new Date(data.birth_date),
      contract_type: data.contract_type,
      admission_date: new Date(data.admission_date),
      termination_date: data.termination_date ? new Date(data.termination_date) : null,
      termination_reason: data.termination_reason || null,
      status: data.status,
      salary: data.salary || null,
      is_in_payroll: data.is_in_payroll || false,
      legal_data: data.legal_data
    };

    return await this.repository.create(employeeData);
  }

  async update(employeeId: string, companyId: string, data: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findByIdAndCompany(employeeId, companyId);

    // Verificar CPF se foi alterado
    if (data.cpf && data.cpf !== employee.cpf) {
      const cpfExists = await (this.repository as EmployeeRepository)
        .cpfExists(data.cpf, companyId, employeeId);
      
      if (cpfExists) {
        throw AppError.conflict('CPF já está em uso por outro funcionário');
      }
    }

    // Validar datas se foram alteradas
    if (data.admission_date || data.birth_date) {
      const admissionDate = data.admission_date ? new Date(data.admission_date) : employee.admission_date;
      const birthDate = data.birth_date ? new Date(data.birth_date) : employee.birth_date;
      
      if (admissionDate < birthDate) {
        throw AppError.badRequest('Data de admissão não pode ser anterior à data de nascimento');
      }
    }

    if (data.termination_date) {
      const terminationDate = new Date(data.termination_date);
      const admissionDate = data.admission_date ? new Date(data.admission_date) : employee.admission_date;
      
      if (terminationDate < admissionDate) {
        throw AppError.badRequest('Data de demissão não pode ser anterior à data de admissão');
      }
    }

    // Preparar dados para atualização
    const updateData: any = {};
    
    if (data.cpf) updateData.cpf = data.cpf;
    if (data.rg) updateData.rg = data.rg;
    if (data.birth_date) updateData.birth_date = new Date(data.birth_date);
    if (data.contract_type) updateData.contract_type = data.contract_type;
    if (data.admission_date) updateData.admission_date = new Date(data.admission_date);
    if (data.termination_date) updateData.termination_date = new Date(data.termination_date);
    if (data.termination_reason !== undefined) updateData.termination_reason = data.termination_reason;
    if (data.status) updateData.status = data.status;
    if (data.salary !== undefined) updateData.salary = data.salary;
    if (data.is_in_payroll !== undefined) updateData.is_in_payroll = data.is_in_payroll;
    if (data.legal_data) updateData.legal_data = data.legal_data;

    return await this.repository.update(employeeId, updateData) as Employee;
  }

  async findByIdAndCompany(employeeId: string, companyId: string): Promise<Employee> {
    const employee = await (this.repository as EmployeeRepository).findByIdWithDetails(employeeId);
    
    if (!employee || employee.company_id !== companyId) {
      throw AppError.notFound('Funcionário não encontrado');
    }

    return employee;
  }

  async findByCompanyWithFilters(companyId: string, filters: EmployeeFilterDto): Promise<PaginatedResult<Employee>> {
    return await (this.repository as EmployeeRepository).findWithFilters(companyId, filters);
  }

  async getEmployeeStats(companyId: string): Promise<EmployeeStatsDto> {
    return await (this.repository as EmployeeRepository).getEmployeeStats(companyId);
  }

  async bulkUpdateStatus(companyId: string, data: BulkUpdateEmployeeStatusDto): Promise<{ updated: number }> {
    // Verificar se todos os funcionários pertencem à empresa
    const employees = await Promise.all(
      data.employee_ids.map(id => this.findByIdAndCompany(id, companyId))
    );

    const updatedCount = await (this.repository as EmployeeRepository)
      .bulkUpdateStatus(data.employee_ids, data.status);

    return { updated: updatedCount };
  }

  async togglePayrollStatus(employeeId: string, companyId: string, data: EmployeePayrollToggleDto): Promise<Employee> {
    const employee = await this.findByIdAndCompany(employeeId, companyId);

    // Verificar se o funcionário está ativo para incluir na folha
    if (data.is_in_payroll && employee.status !== EmployeeStatus.ATIVO) {
      throw AppError.badRequest('Apenas funcionários ativos podem ser incluídos na folha de pagamento');
    }

    const updated = await (this.repository as EmployeeRepository)
      .togglePayrollStatus(employeeId, data.is_in_payroll);

    if (!updated) {
      throw AppError.internalServer('Erro ao atualizar status da folha de pagamento');
    }

    return await this.findByIdAndCompany(employeeId, companyId);
  }

  async getEmployeesByStatus(companyId: string, status: EmployeeStatus): Promise<Employee[]> {
    return await (this.repository as EmployeeRepository).findByStatus(companyId, status);
  }

  async getEmployeesInPayroll(companyId: string): Promise<Employee[]> {
    return await (this.repository as EmployeeRepository).findInPayroll(companyId);
  }

  async getUpcomingBirthdays(companyId: string, days: number = 30): Promise<Employee[]> {
    return await (this.repository as EmployeeRepository)
      .findEmployeesWithUpcomingBirthdays(companyId, days);
  }

  async getEmployeesByRole(companyId: string, roleId: string): Promise<Employee[]> {
    return await (this.repository as EmployeeRepository).getEmployeesByRole(companyId, roleId);
  }

  async searchEmployees(companyId: string, searchTerm: string): Promise<Employee[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw AppError.badRequest('Termo de busca deve ter pelo menos 2 caracteres');
    }

    return await (this.repository as EmployeeRepository).searchEmployees(companyId, searchTerm.trim());
  }

  async delete(employeeId: string, companyId: string): Promise<void> {
    const employee = await this.findByIdAndCompany(employeeId, companyId);

    // Verificar se o funcionário pode ser excluído
    // Por exemplo, não permitir exclusão se houver registros de folha de pagamento
    // Esta validação seria expandida conforme as regras de negócio

    // Excluir documentos relacionados
    await this.employeeDocumentRepository.deleteByEmployeeId(employeeId);

    // Excluir funcionário
    await this.repository.delete(employeeId);
  }

  async getEmployeeDocumentStats(employeeId: string, companyId: string): Promise<any> {
    await this.findByIdAndCompany(employeeId, companyId);
    return await this.employeeDocumentRepository.getDocumentStats(employeeId);
  }

  async validateEmployeeData(data: CreateEmployeeDto | UpdateEmployeeDto): Promise<void> {
    // Validações adicionais de negócio
    
    if ('cpf' in data && data.cpf) {
      // Validar formato do CPF
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
      if (!cpfRegex.test(data.cpf)) {
        throw AppError.badRequest('Formato de CPF inválido');
      }
    }

    if ('salary' in data && data.salary !== undefined) {
      if (data.salary < 0) {
        throw AppError.badRequest('Salário não pode ser negativo');
      }
    }

    // Validar dados legais se fornecidos
    if ('legal_data' in data && data.legal_data) {
      const { legal_data } = data;
      
      if (legal_data.pis) {
        const pisRegex = /^\d{3}\.\d{5}\.\d{2}-\d{1}$|^\d{11}$/;
        if (!pisRegex.test(legal_data.pis)) {
          throw AppError.badRequest('Formato de PIS inválido');
        }
      }

      if (legal_data.phone) {
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$|^\d{10,11}$/;
        if (!phoneRegex.test(legal_data.phone)) {
          throw AppError.badRequest('Formato de telefone inválido');
        }
      }
    }
  }

  protected async beforeCreate(data: CreateEmployeeDto): Promise<void> {
    await this.validateEmployeeData(data);
  }

  protected async beforeUpdate(id: string | number, data: UpdateEmployeeDto): Promise<void> {
    await this.validateEmployeeData(data);
  }
}

