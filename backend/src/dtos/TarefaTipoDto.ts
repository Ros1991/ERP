import { IsNotEmpty, IsString, Length, IsOptional, IsEmail, IsInt, IsNumber, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IDto } from '@/core/base/BaseDto';

// CREATE
export class CreateTarefaTipoDto implements IDto {
  @IsNotEmpty()
  @IsNumber()
  empresaId!: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  nome!: string;

  @IsNotEmpty()
  @IsNumber()
  gerenteFuncionarioId!: number;

  @IsNotEmpty()
  @IsNumber()
  centroCustoId!: number;

  @IsOptional()
  @IsString()
  @Length(1, 7)
  cor?: string;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  ativo!: boolean;

}

// UPDATE
export class UpdateTarefaTipoDto implements IDto {
  @IsOptional()
  @IsNumber()
  empresaId?: number;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  nome?: string;

  @IsOptional()
  @IsNumber()
  gerenteFuncionarioId?: number;

  @IsOptional()
  @IsNumber()
  centroCustoId?: number;

  @IsOptional()
  @IsString()
  @Length(1, 7)
  cor?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  ativo?: boolean;

}

// RESPONSE
export class TarefaTipoResponseDto implements IDto {
  @IsInt()
  tipoId!: number;
  
  empresaId!: number;
  nome!: string;
  gerenteFuncionarioId!: number;
  centroCustoId!: number;
  cor!: string;
  ativo!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}
