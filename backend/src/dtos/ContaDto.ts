import { IsNotEmpty, IsString, Length, IsOptional, IsEmail, IsInt, IsNumber, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IDto } from '@/core/base/BaseDto';

// CREATE
export class CreateContaDto implements IDto {
  @IsNotEmpty()
  @IsNumber()
  empresaId!: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  nome!: string;

  @IsNotEmpty()
  @IsString()
  tipo!: string;

  @IsNotEmpty()
  @IsNumber()
  saldoInicial!: number;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  ativa!: boolean;

}

// UPDATE
export class UpdateContaDto implements IDto {
  @IsOptional()
  @IsNumber()
  empresaId?: number;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  nome?: string;

  @IsOptional()
  @IsString()
  tipo?: string;

  @IsOptional()
  @IsNumber()
  saldoInicial?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  ativa?: boolean;

}

// RESPONSE
export class ContaResponseDto implements IDto {
  @IsInt()
  contaId!: number;
  
  empresaId!: number;
  nome!: string;
  tipo!: string;
  saldoInicial!: number;
  ativa!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}
