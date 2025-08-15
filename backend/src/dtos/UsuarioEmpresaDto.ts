import { IsNotEmpty, IsString, Length, IsOptional, IsEmail, IsInt, IsNumber, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IDto } from '@/core/base/BaseDto';

// CREATE
export class CreateUsuarioEmpresaDto implements IDto {
  @IsNotEmpty()
  @IsNumber()
  userId!: number;

  @IsNotEmpty()
  @IsNumber()
  empresaId!: number;

  @IsNotEmpty()
  @IsNumber()
  roleId!: number;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  ativo!: boolean;

}

// UPDATE
export class UpdateUsuarioEmpresaDto implements IDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  empresaId?: number;

  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  ativo?: boolean;

}

// RESPONSE
export class UsuarioEmpresaResponseDto implements IDto {
  @IsInt()
  usuarioEmpresaId!: number;
  
  userId!: number;
  empresaId!: number;
  roleId!: number;
  ativo!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}
