import { IsNotEmpty, IsString, Length, IsOptional, IsEmail, IsInt, IsNumber, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IDto } from '@/core/base/BaseDto';

// CREATE
export class CreateTarefaDto implements IDto {
  @IsNotEmpty()
  @IsNumber()
  empresaId!: number;

  @IsNotEmpty()
  @IsNumber()
  tipoId!: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  titulo!: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNotEmpty()
  @IsString()
  status!: string;

  @IsNotEmpty()
  @IsString()
  prioridade!: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dataInicio!: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dataPrazo!: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dataConclusao!: Date;

}

// UPDATE
export class UpdateTarefaDto implements IDto {
  @IsOptional()
  @IsNumber()
  empresaId?: number;

  @IsOptional()
  @IsNumber()
  tipoId?: number;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  titulo?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  prioridade?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataInicio?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataPrazo?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataConclusao?: Date;

}

// RESPONSE
export class TarefaResponseDto implements IDto {
  @IsInt()
  tarefaId!: number;
  
  empresaId!: number;
  tipoId!: number;
  titulo!: string;
  descricao!: string;
  status!: string;
  prioridade!: string;
  dataInicio!: Date;
  dataPrazo!: Date;
  dataConclusao!: Date;

  createdAt!: Date;
  updatedAt!: Date;
}
