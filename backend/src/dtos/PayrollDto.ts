import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsDateString, IsArray, IsUUID, Min, Max, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { BaseDto, PaginationDto, FilterDto } from './BaseDto';

export enum PayrollPeriodType {
  MENSAL = 'MENSAL',
  QUINZENAL = 'QUINZENAL',
  SEMANAL = 'SEMANAL'
}

export enum PayrollStatus {
  RASCUNHO = 'RASCUNHO',
  EM_PROCESSAMENTO = 'EM_PROCESSAMENTO',
  PROCESSADA = 'PROCESSADA',
  PAGA = 'PAGA',
  CANCELADA = 'CANCELADA'
}

export enum PayrollItemType {
  SALARIO_BASE = 'SALARIO_BASE',
  HORAS_EXTRAS = 'HORAS_EXTRAS',
  ADICIONAL_NOTURNO = 'ADICIONAL_NOTURNO',
  COMISSAO = 'COMISSAO',
  BONUS = 'BONUS',
  VALE_TRANSPORTE = 'VALE_TRANSPORTE',
  VALE_REFEICAO = 'VALE_REFEICAO',
  PLANO_SAUDE = 'PLANO_SAUDE',
  INSS = 'INSS',
  IRRF = 'IRRF',
  FGTS = 'FGTS',
  DESCONTO_ATRASO = 'DESCONTO_ATRASO',
  DESCONTO_FALTA = 'DESCONTO_FALTA',
  OUTROS_PROVENTOS = 'OUTROS_PROVENTOS',
  OUTROS_DESCONTOS = 'OUTROS_DESCONTOS'
}

export enum PayrollCalculationType {
  FIXO = 'FIXO',
  PERCENTUAL = 'PERCENTUAL',
  HORAS = 'HORAS',
  CALCULADO = 'CALCULADO'
}

export class CreatePayrollPeriodDto extends BaseDto {
  @IsString({ message: 'Nome do período é obrigatório' })
  name!: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @IsEnum(PayrollPeriodType, { message: 'Tipo de período inválido' })
  period_type!: PayrollPeriodType;

  @IsDateString({}, { message: 'Data de início deve ser uma data válida' })
  period_start!: string;

  @IsDateString({}, { message: 'Data de fim deve ser uma data válida' })
  period_end!: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de pagamento deve ser uma data válida' })
  payment_date?: string;

  @IsOptional()
  @IsEnum(PayrollStatus, { message: 'Status inválido' })
  status?: PayrollStatus;
}

export class UpdatePayrollPeriodDto {
  @IsOptional()
  @IsString({ message: 'Nome do período deve ser uma string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de início deve ser uma data válida' })
  period_start?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de fim deve ser uma data válida' })
  period_end?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de pagamento deve ser uma data válida' })
  payment_date?: string;

  @IsOptional()
  @IsEnum(PayrollStatus, { message: 'Status inválido' })
  status?: PayrollStatus;
}

export class CreatePayrollItemDto extends BaseDto {
  @IsUUID(4, { message: 'ID do funcionário deve ser um UUID válido' })
  employee_id!: string;

  @IsEnum(PayrollItemType, { message: 'Tipo de item inválido' })
  item_type!: PayrollItemType;

  @IsString({ message: 'Descrição é obrigatória' })
  description!: string;

  @IsEnum(PayrollCalculationType, { message: 'Tipo de cálculo inválido' })
  calculation_type!: PayrollCalculationType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor base deve ser um número com até 2 casas decimais' })
  @Min(0, { message: 'Valor base deve ser maior ou igual a zero' })
  base_value?: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor calculado deve ser um número com até 2 casas decimais' })
  calculated_value!: number;

  @IsOptional()
  @IsString({ message: 'Referência legal deve ser uma string' })
  legal_reference?: string;

  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  notes?: string;
}

export class UpdatePayrollItemDto {
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @IsOptional()
  @IsEnum(PayrollCalculationType, { message: 'Tipo de cálculo inválido' })
  calculation_type?: PayrollCalculationType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor base deve ser um número com até 2 casas decimais' })
  @Min(0, { message: 'Valor base deve ser maior ou igual a zero' })
  base_value?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor calculado deve ser um número com até 2 casas decimais' })
  calculated_value?: number;

  @IsOptional()
  @IsString({ message: 'Referência legal deve ser uma string' })
  legal_reference?: string;

  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  notes?: string;
}

export class CreateEmployeeTimeSheetDto extends BaseDto {
  @IsUUID(4, { message: 'ID do funcionário deve ser um UUID válido' })
  employee_id!: string;

  @IsDateString({}, { message: 'Data deve ser uma data válida' })
  date!: string;

  @IsOptional()
  @IsDateString({}, { message: 'Hora de entrada deve ser uma data válida' })
  clock_in?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Hora de saída deve ser uma data válida' })
  clock_out?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Horas trabalhadas deve ser um número com até 2 casas decimais' })
  @Min(0, { message: 'Horas trabalhadas deve ser maior ou igual a zero' })
  hours_worked?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Horas extras deve ser um número com até 2 casas decimais' })
  @Min(0, { message: 'Horas extras deve ser maior ou igual a zero' })
  overtime_hours?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Tempo de intervalo deve ser um número com até 2 casas decimais' })
  @Min(0, { message: 'Tempo de intervalo deve ser maior ou igual a zero' })
  break_time?: number;

  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  notes?: string;

  @IsOptional()
  @IsBoolean({ message: 'Campo de aprovação deve ser um booleano' })
  is_approved?: boolean;
}

export class UpdateEmployeeTimeSheetDto {
  @IsOptional()
  @IsDateString({}, { message: 'Hora de entrada deve ser uma data válida' })
  clock_in?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Hora de saída deve ser uma data válida' })
  clock_out?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Horas trabalhadas deve ser um número com até 2 casas decimais' })
  @Min(0, { message: 'Horas trabalhadas deve ser maior ou igual a zero' })
  hours_worked?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Horas extras deve ser um número com até 2 casas decimais' })
  @Min(0, { message: 'Horas extras deve ser maior ou igual a zero' })
  overtime_hours?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Tempo de intervalo deve ser um número com até 2 casas decimais' })
  @Min(0, { message: 'Tempo de intervalo deve ser maior ou igual a zero' })
  break_time?: number;

  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  notes?: string;

  @IsOptional()
  @IsBoolean({ message: 'Campo de aprovação deve ser um booleano' })
  is_approved?: boolean;
}

export class PayrollFilterDto extends FilterDto {
  @IsOptional()
  @IsEnum(PayrollStatus, { message: 'Status inválido' })
  status?: PayrollStatus;

  @IsOptional()
  @IsEnum(PayrollPeriodType, { message: 'Tipo de período inválido' })
  period_type?: PayrollPeriodType;

  @IsOptional()
  @IsUUID(4, { message: 'ID do funcionário deve ser um UUID válido' })
  employee_id?: string;

  @IsOptional()
  @IsEnum(PayrollItemType, { message: 'Tipo de item inválido' })
  item_type?: PayrollItemType;

  @IsOptional()
  @IsDateString({}, { message: 'Data inicial deve ser uma data válida' })
  period_start?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data final deve ser uma data válida' })
  period_end?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de pagamento inicial deve ser uma data válida' })
  payment_date_start?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de pagamento final deve ser uma data válida' })
  payment_date_end?: string;
}

export class PayrollPeriodResponseDto {
  @IsUUID()
  id!: string;

  @IsUUID()
  company_id!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(PayrollPeriodType)
  period_type!: PayrollPeriodType;

  @IsDateString()
  period_start!: string;

  @IsDateString()
  period_end!: string;

  @IsOptional()
  @IsDateString()
  payment_date?: string;

  @IsNumber()
  total_gross!: number;

  @IsNumber()
  total_deductions!: number;

  @IsNumber()
  total_net!: number;

  @IsEnum(PayrollStatus)
  status!: PayrollStatus;

  @IsOptional()
  @IsDateString()
  processed_at?: string;

  @IsOptional()
  @IsUUID()
  processed_by_user_id?: string;

  @IsDateString()
  created_at!: string;

  @IsDateString()
  updated_at!: string;

  // Relacionamentos
  processed_by_user?: {
    id: string;
    name: string;
    email: string;
  };

  payroll_items?: PayrollItemResponseDto[];
  employee_count?: number;
}

export class PayrollItemResponseDto {
  @IsUUID()
  id!: string;

  @IsUUID()
  payroll_period_id!: string;

  @IsUUID()
  employee_id!: string;

  @IsEnum(PayrollItemType)
  item_type!: PayrollItemType;

  @IsString()
  description!: string;

  @IsEnum(PayrollCalculationType)
  calculation_type!: PayrollCalculationType;

  @IsOptional()
  @IsNumber()
  base_value?: number;

  @IsNumber()
  calculated_value!: number;

  @IsOptional()
  @IsString()
  legal_reference?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsDateString()
  created_at!: string;

  @IsDateString()
  updated_at!: string;

  // Relacionamentos
  employee?: {
    id: string;
    company_member: {
      user: {
        id: string;
        name: string;
        email: string;
      };
    };
  };
}

export class EmployeeTimeSheetResponseDto {
  @IsUUID()
  id!: string;

  @IsUUID()
  employee_id!: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsDateString()
  clock_in?: string;

  @IsOptional()
  @IsDateString()
  clock_out?: string;

  @IsOptional()
  @IsNumber()
  hours_worked?: number;

  @IsOptional()
  @IsNumber()
  overtime_hours?: number;

  @IsOptional()
  @IsNumber()
  break_time?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsBoolean()
  is_approved!: boolean;

  @IsOptional()
  @IsUUID()
  approved_by_user_id?: string;

  @IsOptional()
  @IsDateString()
  approved_at?: string;

  @IsDateString()
  created_at!: string;

  @IsDateString()
  updated_at!: string;

  // Relacionamentos
  employee?: {
    id: string;
    company_member: {
      user: {
        id: string;
        name: string;
        email: string;
      };
    };
  };

  approved_by?: {
    id: string;
    name: string;
    email: string;
  };
}

export class PayrollStatsDto {
  total_periods!: number;
  active_periods!: number;
  processed_periods!: number;
  total_employees_in_payroll!: number;
  current_month_gross!: number;
  current_month_deductions!: number;
  current_month_net!: number;
  periods_by_status!: Record<PayrollStatus, number>;
  items_by_type!: Record<PayrollItemType, number>;
  average_salary!: number;
  total_overtime_hours!: number;
  pending_approvals!: number;
}

export class ProcessPayrollDto {
  @IsUUID(4, { message: 'ID do período deve ser um UUID válido' })
  payroll_period_id!: string;

  @IsOptional()
  @IsArray({ message: 'IDs dos funcionários deve ser um array' })
  @IsUUID(4, { each: true, message: 'Cada ID de funcionário deve ser um UUID válido' })
  employee_ids?: string[];

  @IsOptional()
  @IsBoolean({ message: 'Campo de recálculo deve ser um booleano' })
  recalculate?: boolean;
}

export class BulkApproveTimeSheetDto {
  @IsArray({ message: 'IDs deve ser um array' })
  @IsUUID(4, { each: true, message: 'Cada ID deve ser um UUID válido' })
  timesheet_ids!: string[];

  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  notes?: string;
}

