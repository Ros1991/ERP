import { IsNotEmpty, IsString, Length, IsOptional, IsEmail, IsInt, IsNumber, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IDto } from '@/core/base/BaseDto';

// CREATE
export class CreateFuncionarioContratoDto implements IDto {
  @IsNotEmpty()
  @IsNumber()
  funcionarioId!: number;

  @IsNotEmpty()
  @IsString()
  tipoContrato!: string;

  @IsNotEmpty()
  @IsString()
  tipoPagamento!: string;

  @IsOptional()
  @IsString()
  formaPagamento?: string;

  @IsNotEmpty()
  @IsNumber()
  salario!: number;

  @IsNotEmpty()
  @IsNumber()
  cargaHorariaSemanal!: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dataInicio!: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dataFim!: Date;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  ativo!: boolean;

  @IsOptional()
  @IsString()
  observacoes?: string;

}

// UPDATE
export class UpdateFuncionarioContratoDto implements IDto {
  @IsOptional()
  @IsNumber()
  funcionarioId?: number;

  @IsOptional()
  @IsString()
  tipoContrato?: string;

  @IsOptional()
  @IsString()
  tipoPagamento?: string;

  @IsOptional()
  @IsString()
  formaPagamento?: string;

  @IsOptional()
  @IsNumber()
  salario?: number;

  @IsOptional()
  @IsNumber()
  cargaHorariaSemanal?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataInicio?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataFim?: Date;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  ativo?: boolean;

  @IsOptional()
  @IsString()
  observacoes?: string;

}

// RESPONSE
export class FuncionarioContratoResponseDto implements IDto {
  @IsInt()
  contratoId!: number;
  
  funcionarioId!: number;
  tipoContrato!: string;
  tipoPagamento!: string;
  formaPagamento!: string;
  salario!: number;
  cargaHorariaSemanal!: number;
  dataInicio!: Date;
  dataFim!: Date;
  ativo!: boolean;
  observacoes!: string;

  createdAt!: Date;
  updatedAt!: Date;
}
