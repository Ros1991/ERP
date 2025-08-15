import { IsNotEmpty, IsString, Length, IsOptional, IsEmail, IsInt, IsNumber, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IDto } from '@/core/base/BaseDto';

// CREATE
export class CreateFuncionarioDto implements IDto {
  @IsNotEmpty()
  @IsNumber()
  empresaId!: number;

  @IsNotEmpty()
  @IsNumber()
  usuarioEmpresaId!: number;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  nome?: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  apelido!: string;

  @IsOptional()
  @IsString()
  @Length(1, 14)
  cpf?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  rg?: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dataNascimento!: Date;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  telefone?: string;

  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  ativo!: boolean;

}

// UPDATE
export class UpdateFuncionarioDto implements IDto {
  @IsOptional()
  @IsNumber()
  empresaId?: number;

  @IsOptional()
  @IsNumber()
  usuarioEmpresaId?: number;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  nome?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  apelido?: string;

  @IsOptional()
  @IsString()
  @Length(1, 14)
  cpf?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  rg?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataNascimento?: Date;

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
export class FuncionarioResponseDto implements IDto {
  @IsInt()
  funcionarioId!: number;
  
  empresaId!: number;
  usuarioEmpresaId!: number;
  nome!: string;
  apelido!: string;
  cpf!: string;
  rg!: string;
  dataNascimento!: Date;
  endereco!: string;
  telefone!: string;
  email!: string;
  ativo!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}
