import { IsNotEmpty, IsString, Length, IsOptional, IsEmail, IsInt, IsNumber, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IDto } from '@/core/base/BaseDto';

// CREATE
export class CreateTarefaHistoriaDto implements IDto {
  @IsNotEmpty()
  @IsNumber()
  tarefaId!: number;

  @IsNotEmpty()
  @IsNumber()
  usuarioEmpresaId!: number;

  @IsNotEmpty()
  @IsString()
  tipoEvento!: string;

  @IsOptional()
  @IsString()
  comentario?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  arquivoUrl?: string;

  @IsNotEmpty()
  // Any type - no validation
  dadosAlterados!: any;

}

// UPDATE
export class UpdateTarefaHistoriaDto implements IDto {
  @IsOptional()
  @IsNumber()
  tarefaId?: number;

  @IsOptional()
  @IsNumber()
  usuarioEmpresaId?: number;

  @IsOptional()
  @IsString()
  tipoEvento?: string;

  @IsOptional()
  @IsString()
  comentario?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  arquivoUrl?: string;

  @IsOptional()
  dadosAlterados?: any;

}

// RESPONSE
export class TarefaHistoriaResponseDto implements IDto {
  @IsInt()
  historiaId!: number;
  
  tarefaId!: number;
  usuarioEmpresaId!: number;
  tipoEvento!: string;
  comentario!: string;
  arquivoUrl!: string;
  dadosAlterados!: any;

  createdAt!: Date;
  updatedAt!: Date;
}
