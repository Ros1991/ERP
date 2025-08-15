import { IsNotEmpty, IsString, Length, IsOptional, IsEmail, IsInt, IsNumber, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IDto } from '@/core/base/BaseDto';

// CREATE
export class CreateTransacaoFinanceiraDto implements IDto {
  @IsNotEmpty()
  @IsNumber()
  empresaId!: number;

  @IsNotEmpty()
  @IsString()
  tipo!: string;

  @IsNotEmpty()
  @IsNumber()
  contaId!: number;

  @IsNotEmpty()
  @IsNumber()
  terceiroId!: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  descricao!: string;

  @IsNotEmpty()
  @IsNumber()
  valor!: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dataTransacao!: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dataVencimento!: Date;

  @IsNotEmpty()
  @IsString()
  status!: string;

  @IsOptional()
  @IsString()
  observacoes?: string;

}

// UPDATE
export class UpdateTransacaoFinanceiraDto implements IDto {
  @IsOptional()
  @IsNumber()
  empresaId?: number;

  @IsOptional()
  @IsString()
  tipo?: string;

  @IsOptional()
  @IsNumber()
  contaId?: number;

  @IsOptional()
  @IsNumber()
  terceiroId?: number;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  descricao?: string;

  @IsOptional()
  @IsNumber()
  valor?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataTransacao?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataVencimento?: Date;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;

}

// RESPONSE
export class TransacaoFinanceiraResponseDto implements IDto {
  @IsInt()
  transacaoId!: number;
  
  empresaId!: number;
  tipo!: string;
  contaId!: number;
  terceiroId!: number;
  descricao!: string;
  valor!: number;
  dataTransacao!: Date;
  dataVencimento!: Date;
  status!: string;
  observacoes!: string;

  createdAt!: Date;
  updatedAt!: Date;
}
