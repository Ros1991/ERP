import { IsString, IsEmail, IsOptional, IsEnum, IsDateString, IsNumber, IsBoolean, IsObject, ValidateNested, IsArray, IsUUID, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { BaseDto, PaginationDto, FilterDto } from './BaseDto';

export enum ContractType {
  CLT = 'CLT',
  PJ = 'PJ',
  FREELANCER = 'FREELANCER',
  ESTAGIARIO = 'ESTAGIARIO',
  TERCEIRIZADO = 'TERCEIRIZADO'
}

export enum EmployeeStatus {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  AFASTADO = 'AFASTADO',
  DEMITIDO = 'DEMITIDO',
  APOSENTADO = 'APOSENTADO'
}

export class BankDetailsDto {
  @IsString({ message: 'Banco é obrigatório' })
  bank!: string;

  @IsString({ message: 'Agência é obrigatória' })
  agency!: string;

  @IsString({ message: 'Conta é obrigatória' })
  account!: string;
}

export class LegalDataDto {
  @IsString({ message: 'Endereço é obrigatório' })
  address!: string;

  @IsString({ message: 'Telefone é obrigatório' })
  phone!: string;

  @IsString({ message: 'Contato de emergência é obrigatório' })
  emergency_contact!: string;

  @ValidateNested()
  @Type(() => BankDetailsDto)
  bank_details!: BankDetailsDto;

  @IsString({ message: 'PIS é obrigatório' })
  pis!: string;

  @IsArray({ message: 'Dependentes deve ser um array' })
  dependents!: any[];
}

export class CreateEmployeeDto extends BaseDto {
  @IsUUID(4, { message: 'ID do membro da empresa deve ser um UUID válido' })
  company_member_id!: string;

  @IsString({ message: 'CPF é obrigatório' })
  cpf!: string;

  @IsString({ message: 'RG é obrigatório' })
  rg!: string;

  @IsDateString({}, { message: 'Data de nascimento deve ser uma data válida' })
  birth_date!: string;

  @IsEnum(ContractType, { message: 'Tipo de contrato inválido' })
  contract_type!: ContractType;

  @IsDateString({}, { message: 'Data de admissão deve ser uma data válida' })
  admission_date!: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de demissão deve ser uma data válida' })
  termination_date?: string;

  @IsOptional()
  @IsString({ message: 'Motivo da demissão deve ser uma string' })
  termination_reason?: string;

  @IsEnum(EmployeeStatus, { message: 'Status do funcionário inválido' })
  status!: EmployeeStatus;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Salário deve ser um número com até 2 casas decimais' })
  @Min(0, { message: 'Salário deve ser maior ou igual a zero' })
  salary?: number;

  @IsOptional()
  @IsBoolean({ message: 'Campo de folha de pagamento deve ser um booleano' })
  is_in_payroll?: boolean;

  @ValidateNested()
  @Type(() => LegalDataDto)
  legal_data!: LegalDataDto;
}

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString({ message: 'CPF deve ser uma string' })
  cpf?: string;

  @IsOptional()
  @IsString({ message: 'RG deve ser uma string' })
  rg?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de nascimento deve ser uma data válida' })
  birth_date?: string;

  @IsOptional()
  @IsEnum(ContractType, { message: 'Tipo de contrato inválido' })
  contract_type?: ContractType;

  @IsOptional()
  @IsDateString({}, { message: 'Data de admissão deve ser uma data válida' })
  admission_date?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de demissão deve ser uma data válida' })
  termination_date?: string;

  @IsOptional()
  @IsString({ message: 'Motivo da demissão deve ser uma string' })
  termination_reason?: string;

  @IsOptional()
  @IsEnum(EmployeeStatus, { message: 'Status do funcionário inválido' })
  status?: EmployeeStatus;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Salário deve ser um número com até 2 casas decimais' })
  @Min(0, { message: 'Salário deve ser maior ou igual a zero' })
  salary?: number;

  @IsOptional()
  @IsBoolean({ message: 'Campo de folha de pagamento deve ser um booleano' })
  is_in_payroll?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => LegalDataDto)
  legal_data?: LegalDataDto;
}

export class EmployeeFilterDto extends FilterDto {
  @IsOptional()
  @IsEnum(ContractType, { message: 'Tipo de contrato inválido' })
  contract_type?: ContractType;

  @IsOptional()
  @IsEnum(EmployeeStatus, { message: 'Status do funcionário inválido' })
  status?: EmployeeStatus;

  @IsOptional()
  @IsBoolean({ message: 'Campo de folha de pagamento deve ser um booleano' })
  is_in_payroll?: boolean;

  @IsOptional()
  @IsDateString({}, { message: 'Data de admissão inicial deve ser uma data válida' })
  admission_date_start?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de admissão final deve ser uma data válida' })
  admission_date_end?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Salário mínimo deve ser um número' })
  @Min(0, { message: 'Salário mínimo deve ser maior ou igual a zero' })
  salary_min?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Salário máximo deve ser um número' })
  @Min(0, { message: 'Salário máximo deve ser maior ou igual a zero' })
  salary_max?: number;
}

export class EmployeeResponseDto {
  @IsUUID()
  id!: string;

  @IsUUID()
  company_id!: string;

  @IsUUID()
  company_member_id!: string;

  @IsString()
  cpf!: string;

  @IsString()
  rg!: string;

  @IsDateString()
  birth_date!: string;

  @IsEnum(ContractType)
  contract_type!: ContractType;

  @IsDateString()
  admission_date!: string;

  @IsOptional()
  @IsDateString()
  termination_date?: string;

  @IsOptional()
  @IsString()
  termination_reason?: string;

  @IsEnum(EmployeeStatus)
  status!: EmployeeStatus;

  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsBoolean()
  is_in_payroll!: boolean;

  @IsObject()
  legal_data!: LegalDataDto;

  @IsDateString()
  created_at!: string;

  @IsDateString()
  updated_at!: string;

  // Relacionamentos
  company_member?: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    role: {
      id: string;
      name: string;
    };
  };

  documents?: EmployeeDocumentResponseDto[];
}

export class EmployeeDocumentResponseDto {
  @IsUUID()
  id!: string;

  @IsString()
  document_type!: string;

  @IsString()
  file_url!: string;

  @IsString()
  file_name!: string;

  @IsNumber()
  file_size!: number;

  @IsString()
  mime_type!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  created_at!: string;

  uploaded_by?: {
    id: string;
    name: string;
    email: string;
  };
}

export class CreateEmployeeDocumentDto {
  @IsString({ message: 'Tipo de documento é obrigatório' })
  document_type!: string;

  @IsString({ message: 'URL do arquivo é obrigatória' })
  file_url!: string;

  @IsString({ message: 'Nome do arquivo é obrigatório' })
  file_name!: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Tamanho do arquivo deve ser um número' })
  @Min(1, { message: 'Tamanho do arquivo deve ser maior que zero' })
  file_size!: number;

  @IsString({ message: 'Tipo MIME é obrigatório' })
  mime_type!: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;
}

export class UpdateEmployeeDocumentDto {
  @IsOptional()
  @IsString({ message: 'Tipo de documento deve ser uma string' })
  document_type?: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;
}

export class EmployeeStatsDto {
  total_employees!: number;
  active_employees!: number;
  inactive_employees!: number;
  employees_in_payroll!: number;
  contract_type_distribution!: Record<ContractType, number>;
  status_distribution!: Record<EmployeeStatus, number>;
  average_salary!: number;
  recent_hires!: number; // últimos 30 dias
  upcoming_contract_renewals!: number; // próximos 30 dias
}

export class BulkUpdateEmployeeStatusDto {
  @IsArray({ message: 'IDs deve ser um array' })
  @IsUUID(4, { each: true, message: 'Cada ID deve ser um UUID válido' })
  employee_ids!: string[];

  @IsEnum(EmployeeStatus, { message: 'Status do funcionário inválido' })
  status!: EmployeeStatus;

  @IsOptional()
  @IsString({ message: 'Motivo deve ser uma string' })
  reason?: string;
}

export class EmployeePayrollToggleDto {
  @IsBoolean({ message: 'Campo de folha de pagamento deve ser um booleano' })
  is_in_payroll!: boolean;

  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  notes?: string;
}

