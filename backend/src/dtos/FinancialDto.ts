import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsDateString, IsArray, IsUUID, Min, Max, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { BaseDto, PaginationDto, FilterDto } from './BaseDto';

export enum AccountType {
  CONTA_CORRENTE = 'CONTA_CORRENTE',
  CONTA_POUPANCA = 'CONTA_POUPANCA',
  CONTA_INVESTIMENTO = 'CONTA_INVESTIMENTO',
  CARTAO_CREDITO = 'CARTAO_CREDITO',
  DINHEIRO = 'DINHEIRO',
  OUTROS = 'OUTROS'
}

export enum AccountStatus {
  ATIVA = 'ATIVA',
  INATIVA = 'INATIVA',
  BLOQUEADA = 'BLOQUEADA'
}

export enum TransactionType {
  RECEITA = 'RECEITA',
  DESPESA = 'DESPESA',
  TRANSFERENCIA = 'TRANSFERENCIA'
}

export enum TransactionStatus {
  PENDENTE = 'PENDENTE',
  CONFIRMADA = 'CONFIRMADA',
  CANCELADA = 'CANCELADA'
}

export class BankDetailsDto {
  @IsOptional()
  @IsString({ message: 'Nome do banco deve ser uma string' })
  bank_name?: string;

  @IsOptional()
  @IsString({ message: 'Agência deve ser uma string' })
  agency?: string;

  @IsOptional()
  @IsString({ message: 'Número da conta deve ser uma string' })
  account_number?: string;

  @IsOptional()
  @IsString({ message: 'Tipo da conta deve ser uma string' })
  account_type?: string;
}

export class CreateFinancialAccountDto extends BaseDto {
  @IsString({ message: 'Nome da conta é obrigatório' })
  name!: string;

  @IsEnum(AccountType, { message: 'Tipo de conta inválido' })
  type!: AccountType;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Saldo inicial deve ser um número com até 2 casas decimais' })
  initial_balance?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => BankDetailsDto)
  bank_details?: BankDetailsDto;

  @IsOptional()
  @IsUUID(4, { message: 'ID do usuário proprietário deve ser um UUID válido' })
  owner_user_id?: string;

  @IsOptional()
  @IsEnum(AccountStatus, { message: 'Status da conta inválido' })
  status?: AccountStatus;
}

export class UpdateFinancialAccountDto {
  @IsOptional()
  @IsString({ message: 'Nome da conta deve ser uma string' })
  name?: string;

  @IsOptional()
  @IsEnum(AccountType, { message: 'Tipo de conta inválido' })
  type?: AccountType;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => BankDetailsDto)
  bank_details?: BankDetailsDto;

  @IsOptional()
  @IsUUID(4, { message: 'ID do usuário proprietário deve ser um UUID válido' })
  owner_user_id?: string;

  @IsOptional()
  @IsEnum(AccountStatus, { message: 'Status da conta inválido' })
  status?: AccountStatus;
}

export class CreateCostCenterDto extends BaseDto {
  @IsString({ message: 'Nome do centro de custo é obrigatório' })
  name!: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @IsOptional()
  @IsUUID(4, { message: 'ID do centro de custo pai deve ser um UUID válido' })
  parent_id?: string;

  @IsOptional()
  @IsEnum(AccountStatus, { message: 'Status inválido' })
  status?: AccountStatus;
}

export class UpdateCostCenterDto {
  @IsOptional()
  @IsString({ message: 'Nome do centro de custo deve ser uma string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @IsOptional()
  @IsUUID(4, { message: 'ID do centro de custo pai deve ser um UUID válido' })
  parent_id?: string;

  @IsOptional()
  @IsEnum(AccountStatus, { message: 'Status inválido' })
  status?: AccountStatus;
}

export class TransactionSplitDto {
  @IsUUID(4, { message: 'ID do centro de custo deve ser um UUID válido' })
  cost_center_id!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor deve ser um número com até 2 casas decimais' })
  @Min(0.01, { message: 'Valor deve ser maior que zero' })
  amount!: number;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;
}

export class CreateTransactionDto extends BaseDto {
  @IsEnum(TransactionType, { message: 'Tipo de transação inválido' })
  transaction_type!: TransactionType;

  @IsString({ message: 'Descrição é obrigatória' })
  description!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor deve ser um número com até 2 casas decimais' })
  @Min(0.01, { message: 'Valor deve ser maior que zero' })
  amount!: number;

  @IsDateString({}, { message: 'Data da transação deve ser uma data válida' })
  transaction_date!: string;

  @IsUUID(4, { message: 'ID da conta financeira deve ser um UUID válido' })
  financial_account_id!: string;

  @IsOptional()
  @IsString({ message: 'Número de referência deve ser uma string' })
  reference_number?: string;

  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  notes?: string;

  @IsOptional()
  @IsEnum(TransactionStatus, { message: 'Status da transação inválido' })
  status?: TransactionStatus;

  @IsArray({ message: 'Divisões devem ser um array' })
  @ValidateNested({ each: true })
  @Type(() => TransactionSplitDto)
  splits!: TransactionSplitDto[];
}

export class UpdateTransactionDto {
  @IsOptional()
  @IsEnum(TransactionType, { message: 'Tipo de transação inválido' })
  transaction_type?: TransactionType;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor deve ser um número com até 2 casas decimais' })
  @Min(0.01, { message: 'Valor deve ser maior que zero' })
  amount?: number;

  @IsOptional()
  @IsDateString({}, { message: 'Data da transação deve ser uma data válida' })
  transaction_date?: string;

  @IsOptional()
  @IsUUID(4, { message: 'ID da conta financeira deve ser um UUID válido' })
  financial_account_id?: string;

  @IsOptional()
  @IsString({ message: 'Número de referência deve ser uma string' })
  reference_number?: string;

  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  notes?: string;

  @IsOptional()
  @IsEnum(TransactionStatus, { message: 'Status da transação inválido' })
  status?: TransactionStatus;

  @IsOptional()
  @IsArray({ message: 'Divisões devem ser um array' })
  @ValidateNested({ each: true })
  @Type(() => TransactionSplitDto)
  splits?: TransactionSplitDto[];
}

export class FinancialFilterDto extends FilterDto {
  @IsOptional()
  @IsEnum(AccountType, { message: 'Tipo de conta inválido' })
  account_type?: AccountType;

  @IsOptional()
  @IsEnum(AccountStatus, { message: 'Status da conta inválido' })
  account_status?: AccountStatus;

  @IsOptional()
  @IsEnum(TransactionType, { message: 'Tipo de transação inválido' })
  transaction_type?: TransactionType;

  @IsOptional()
  @IsEnum(TransactionStatus, { message: 'Status da transação inválido' })
  transaction_status?: TransactionStatus;

  @IsOptional()
  @IsUUID(4, { message: 'ID da conta financeira deve ser um UUID válido' })
  financial_account_id?: string;

  @IsOptional()
  @IsUUID(4, { message: 'ID do centro de custo deve ser um UUID válido' })
  cost_center_id?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Valor mínimo deve ser um número' })
  @Min(0, { message: 'Valor mínimo deve ser maior ou igual a zero' })
  amount_min?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Valor máximo deve ser um número' })
  @Min(0, { message: 'Valor máximo deve ser maior ou igual a zero' })
  amount_max?: number;

  @IsOptional()
  @IsDateString({}, { message: 'Data inicial deve ser uma data válida' })
  transaction_date_start?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data final deve ser uma data válida' })
  transaction_date_end?: string;
}

export class FinancialAccountResponseDto {
  @IsUUID()
  id!: string;

  @IsUUID()
  company_id!: string;

  @IsString()
  name!: string;

  @IsEnum(AccountType)
  type!: AccountType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  balance!: number;

  @IsOptional()
  bank_details?: BankDetailsDto;

  @IsOptional()
  @IsUUID()
  owner_user_id?: string;

  @IsEnum(AccountStatus)
  status!: AccountStatus;

  @IsDateString()
  created_at!: string;

  @IsDateString()
  updated_at!: string;

  // Relacionamentos
  owner_user?: {
    id: string;
    name: string;
    email: string;
  };

  transactions_count?: number;
  recent_transactions?: TransactionResponseDto[];
}

export class CostCenterResponseDto {
  @IsUUID()
  id!: string;

  @IsUUID()
  company_id!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  parent_id?: string;

  @IsEnum(AccountStatus)
  status!: AccountStatus;

  @IsDateString()
  created_at!: string;

  @IsDateString()
  updated_at!: string;

  // Relacionamentos
  parent?: CostCenterResponseDto;
  children?: CostCenterResponseDto[];
  transaction_splits_count?: number;
  total_amount?: number;
}

export class TransactionResponseDto {
  @IsUUID()
  id!: string;

  @IsUUID()
  company_id!: string;

  @IsEnum(TransactionType)
  transaction_type!: TransactionType;

  @IsString()
  description!: string;

  @IsNumber()
  amount!: number;

  @IsDateString()
  transaction_date!: string;

  @IsUUID()
  financial_account_id!: string;

  @IsOptional()
  @IsString()
  reference_number?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsEnum(TransactionStatus)
  status!: TransactionStatus;

  @IsDateString()
  created_at!: string;

  @IsDateString()
  updated_at!: string;

  // Relacionamentos
  financial_account?: FinancialAccountResponseDto;
  splits?: TransactionSplitResponseDto[];
}

export class TransactionSplitResponseDto {
  @IsUUID()
  id!: string;

  @IsUUID()
  transaction_id!: string;

  @IsUUID()
  cost_center_id!: string;

  @IsNumber()
  split_amount!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  created_at!: string;

  // Relacionamentos
  cost_center?: CostCenterResponseDto;
}

export class FinancialStatsDto {
  total_accounts!: number;
  active_accounts!: number;
  total_balance!: number;
  total_transactions!: number;
  pending_transactions!: number;
  monthly_revenue!: number;
  monthly_expenses!: number;
  monthly_profit!: number;
  account_type_distribution!: Record<AccountType, number>;
  transaction_type_distribution!: Record<TransactionType, number>;
  cost_center_distribution!: Array<{
    cost_center_id: string;
    cost_center_name: string;
    total_amount: number;
    transaction_count: number;
  }>;
  recent_transactions!: TransactionResponseDto[];
}

export class BulkUpdateTransactionStatusDto {
  @IsArray({ message: 'IDs deve ser um array' })
  @IsUUID(4, { each: true, message: 'Cada ID deve ser um UUID válido' })
  transaction_ids!: string[];

  @IsEnum(TransactionStatus, { message: 'Status da transação inválido' })
  status!: TransactionStatus;

  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  notes?: string;
}

export class TransferBetweenAccountsDto {
  @IsUUID(4, { message: 'ID da conta de origem deve ser um UUID válido' })
  from_account_id!: string;

  @IsUUID(4, { message: 'ID da conta de destino deve ser um UUID válido' })
  to_account_id!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor deve ser um número com até 2 casas decimais' })
  @Min(0.01, { message: 'Valor deve ser maior que zero' })
  amount!: number;

  @IsString({ message: 'Descrição é obrigatória' })
  description!: string;

  @IsDateString({}, { message: 'Data da transferência deve ser uma data válida' })
  transfer_date!: string;

  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  notes?: string;

  @IsUUID(4, { message: 'ID do centro de custo deve ser um UUID válido' })
  cost_center_id!: string;
}

