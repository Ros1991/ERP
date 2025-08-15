import { IsNotEmpty, IsString, Length, IsOptional, IsEmail, IsInt, IsNumber, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IDto } from '@/core/base/BaseDto';

// CREATE
export class CreateEmpresaDto implements IDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  nome!: string;

  @IsOptional()
  @IsString()
  @Length(1, 18)
  cnpj?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  razaoSocial?: string;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  ativa!: boolean;

}

// UPDATE
export class UpdateEmpresaDto implements IDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  nome?: string;

  @IsOptional()
  @IsString()
  @Length(1, 18)
  cnpj?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  razaoSocial?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  ativa?: boolean;

}

// RESPONSE
export class EmpresaResponseDto implements IDto {
  @IsInt()
  empresaId!: number;
  
  nome!: string;
  cnpj!: string;
  razaoSocial!: string;
  ativa!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}
