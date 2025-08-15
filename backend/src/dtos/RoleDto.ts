import { IsNotEmpty, IsString, Length, IsOptional, IsEmail, IsInt, IsNumber, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IDto } from '@/core/base/BaseDto';

// CREATE
export class CreateRoleDto implements IDto {
  @IsNotEmpty()
  @IsNumber()
  empresaId!: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  nome!: string;

  @IsNotEmpty()
  // Any type - no validation
  permissoes!: any;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  ativo!: boolean;

}

// UPDATE
export class UpdateRoleDto implements IDto {
  @IsOptional()
  @IsNumber()
  empresaId?: number;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  nome?: string;

  @IsOptional()
  permissoes?: any;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  ativo?: boolean;

}

// RESPONSE
export class RoleResponseDto implements IDto {
  @IsInt()
  roleId!: number;
  
  empresaId!: number;
  nome!: string;
  permissoes!: any;
  ativo!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}
