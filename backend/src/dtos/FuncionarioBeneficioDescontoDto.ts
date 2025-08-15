import { IsNotEmpty, IsString, Length, IsOptional, IsEmail, IsInt, IsNumber, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IDto } from '@/core/base/BaseDto';

// CREATE
export class CreateFuncionarioBeneficioDescontoDto implements IDto {
  @IsNotEmpty()
  @IsNumber()
  contratoId!: number;

  @IsNotEmpty()
  @IsString()
  tipo!: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  nome!: string;

  @IsNotEmpty()
  @IsNumber()
  valor!: number;

  @IsNotEmpty()
  @IsString()
  frequencia!: string;

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

}

// UPDATE
export class UpdateFuncionarioBeneficioDescontoDto implements IDto {
  @IsOptional()
  @IsNumber()
  contratoId?: number;

  @IsOptional()
  @IsString()
  tipo?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  nome?: string;

  @IsOptional()
  @IsNumber()
  valor?: number;

  @IsOptional()
  @IsString()
  frequencia?: string;

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

}

// RESPONSE
export class FuncionarioBeneficioDescontoResponseDto implements IDto {
  @IsInt()
  beneficioDescontoId!: number;
  
  contratoId!: number;
  tipo!: string;
  nome!: string;
  valor!: number;
  frequencia!: string;
  dataInicio!: Date;
  dataFim!: Date;
  ativo!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}
