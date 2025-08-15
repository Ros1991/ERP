import { IsNotEmpty, IsString, Length, IsOptional, IsEmail, IsInt, IsNumber, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IDto } from '@/core/base/BaseDto';

// CREATE
export class CreateTarefaFuncionarioStatusHistoriaDto implements IDto {
  @IsNotEmpty()
  @IsNumber()
  statusId!: number;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  statusAnterior?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  statusNovo?: string;

  @IsNotEmpty()
  @IsNumber()
  tempoSessaoMinutos!: number;

  @IsOptional()
  @IsString()
  motivo?: string;

}

// UPDATE
export class UpdateTarefaFuncionarioStatusHistoriaDto implements IDto {
  @IsOptional()
  @IsNumber()
  statusId?: number;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  statusAnterior?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  statusNovo?: string;

  @IsOptional()
  @IsNumber()
  tempoSessaoMinutos?: number;

  @IsOptional()
  @IsString()
  motivo?: string;

}

// RESPONSE
export class TarefaFuncionarioStatusHistoriaResponseDto implements IDto {
  @IsInt()
  historiaStatusId!: number;
  
  statusId!: number;
  statusAnterior!: string;
  statusNovo!: string;
  tempoSessaoMinutos!: number;
  motivo!: string;

  createdAt!: Date;
  updatedAt!: Date;
}
