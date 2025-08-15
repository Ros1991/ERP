import { IsNotEmpty, IsString, Length, IsOptional, IsEmail, IsInt, IsNumber, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IDto } from '@/core/base/BaseDto';

// CREATE
export class CreateEmprestimoDto implements IDto {
  @IsNotEmpty()
  @IsNumber()
  empresaId!: number;

  @IsNotEmpty()
  @IsNumber()
  funcionarioId!: number;

  @IsNotEmpty()
  @IsNumber()
  valorTotal!: number;

  @IsNotEmpty()
  @IsNumber()
  valorPago!: number;

  @IsNotEmpty()
  @IsNumber()
  valorPendente!: number;

  @IsNotEmpty()
  @IsNumber()
  totalParcelas!: number;

  @IsNotEmpty()
  @IsNumber()
  parcelasPagas!: number;

  @IsNotEmpty()
  @IsString()
  quandoCobrar!: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dataEmprestimo!: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dataInicioCobranca!: Date;

  @IsNotEmpty()
  @IsString()
  status!: string;

  @IsOptional()
  @IsString()
  observacoes?: string;

}

// UPDATE
export class UpdateEmprestimoDto implements IDto {
  @IsOptional()
  @IsNumber()
  empresaId?: number;

  @IsOptional()
  @IsNumber()
  funcionarioId?: number;

  @IsOptional()
  @IsNumber()
  valorTotal?: number;

  @IsOptional()
  @IsNumber()
  valorPago?: number;

  @IsOptional()
  @IsNumber()
  valorPendente?: number;

  @IsOptional()
  @IsNumber()
  totalParcelas?: number;

  @IsOptional()
  @IsNumber()
  parcelasPagas?: number;

  @IsOptional()
  @IsString()
  quandoCobrar?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataEmprestimo?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataInicioCobranca?: Date;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;

}

// RESPONSE
export class EmprestimoResponseDto implements IDto {
  @IsInt()
  emprestimoId!: number;
  
  empresaId!: number;
  funcionarioId!: number;
  valorTotal!: number;
  valorPago!: number;
  valorPendente!: number;
  totalParcelas!: number;
  parcelasPagas!: number;
  quandoCobrar!: string;
  dataEmprestimo!: Date;
  dataInicioCobranca!: Date;
  status!: string;
  observacoes!: string;

  createdAt!: Date;
  updatedAt!: Date;
}
