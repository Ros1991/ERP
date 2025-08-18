import { IsNotEmpty, IsString, Length, IsOptional, IsEmail, IsInt, IsNumber, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IDto } from '@/core/base/BaseDto';

// CREATE
export class CreateTerceiroDto implements IDto {
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

  @IsOptional()
  @IsString()
  @Length(1, 18)
  cnpjCpf?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  ativo!: boolean;

}

// UPDATE
export class UpdateTerceiroDto implements IDto {
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
  @IsString()
  @Length(1, 18)
  cnpjCpf?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefone?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  ativo?: boolean;

}

// RESPONSE
export class TerceiroResponseDto implements IDto {
  @IsInt()
  terceiroId!: number;
  
  empresaId!: number;
  nome!: string;
  tipo!: string;
  cnpjCpf!: string;
  endereco!: string;
  telefone!: string;
  email!: string;
  ativo!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}
