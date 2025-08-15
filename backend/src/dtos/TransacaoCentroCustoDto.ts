import { IsNotEmpty, IsString, Length, IsOptional, IsEmail, IsInt, IsNumber, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IDto } from '@/core/base/BaseDto';

// CREATE
export class CreateTransacaoCentroCustoDto implements IDto {
  @IsNotEmpty()
  @IsNumber()
  transacaoId!: number;

  @IsNotEmpty()
  @IsNumber()
  centroCustoId!: number;

  @IsNotEmpty()
  @IsNumber()
  percentual!: number;

  @IsNotEmpty()
  @IsNumber()
  valor!: number;

}

// UPDATE
export class UpdateTransacaoCentroCustoDto implements IDto {
  @IsOptional()
  @IsNumber()
  transacaoId?: number;

  @IsOptional()
  @IsNumber()
  centroCustoId?: number;

  @IsOptional()
  @IsNumber()
  percentual?: number;

  @IsOptional()
  @IsNumber()
  valor?: number;

}

// RESPONSE
export class TransacaoCentroCustoResponseDto implements IDto {
  @IsInt()
  transacaoCentroCustoId!: number;
  
  transacaoId!: number;
  centroCustoId!: number;
  percentual!: number;
  valor!: number;

  createdAt!: Date;
  updatedAt!: Date;
}
