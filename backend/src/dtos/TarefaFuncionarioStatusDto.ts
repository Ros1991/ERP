import { IsNotEmpty, IsString, Length, IsOptional, IsEmail, IsInt, IsNumber, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IDto } from '@/core/base/BaseDto';

// CREATE
export class CreateTarefaFuncionarioStatusDto implements IDto {
  @IsNotEmpty()
  @IsNumber()
  tarefaId!: number;

  @IsNotEmpty()
  @IsNumber()
  funcionarioId!: number;

  @IsNotEmpty()
  @IsString()
  status!: string;

  @IsNotEmpty()
  @IsNumber()
  tempoGastoMinutos!: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dataAtribuicao!: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dataInicio!: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dataConclusao!: Date;

  @IsOptional()
  @IsString()
  observacoesFuncionario?: string;

}

// UPDATE
export class UpdateTarefaFuncionarioStatusDto implements IDto {
  @IsOptional()
  @IsNumber()
  tarefaId?: number;

  @IsOptional()
  @IsNumber()
  funcionarioId?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  tempoGastoMinutos?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataAtribuicao?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataInicio?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataConclusao?: Date;

  @IsOptional()
  @IsString()
  observacoesFuncionario?: string;

}

// RESPONSE
export class TarefaFuncionarioStatusResponseDto implements IDto {
  @IsInt()
  statusId!: number;
  
  tarefaId!: number;
  funcionarioId!: number;
  status!: string;
  tempoGastoMinutos!: number;
  dataAtribuicao!: Date;
  dataInicio!: Date;
  dataConclusao!: Date;
  observacoesFuncionario!: string;

  createdAt!: Date;
  updatedAt!: Date;
}
