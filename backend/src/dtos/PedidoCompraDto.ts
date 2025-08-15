import { IsNotEmpty, IsString, Length, IsOptional, IsEmail, IsInt, IsNumber, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IDto } from '@/core/base/BaseDto';

// CREATE
export class CreatePedidoCompraDto implements IDto {
  @IsNotEmpty()
  @IsNumber()
  empresaId!: number;

  @IsNotEmpty()
  @IsNumber()
  terceiroId!: number;

  @IsNotEmpty()
  @IsNumber()
  usuarioEmpresaSolicitanteId!: number;

  @IsNotEmpty()
  @IsNumber()
  centroCustoId!: number;

  @IsNotEmpty()
  @IsString()
  descricao!: string;

  @IsNotEmpty()
  @IsNumber()
  valorEstimado!: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dataSolicitacao!: Date;

  @IsNotEmpty()
  @IsString()
  status!: string;

}

// UPDATE
export class UpdatePedidoCompraDto implements IDto {
  @IsOptional()
  @IsNumber()
  empresaId?: number;

  @IsOptional()
  @IsNumber()
  terceiroId?: number;

  @IsOptional()
  @IsNumber()
  usuarioEmpresaSolicitanteId?: number;

  @IsOptional()
  @IsNumber()
  centroCustoId?: number;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsNumber()
  valorEstimado?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataSolicitacao?: Date;

  @IsOptional()
  @IsString()
  status?: string;

}

// RESPONSE
export class PedidoCompraResponseDto implements IDto {
  @IsInt()
  pedidoId!: number;
  
  empresaId!: number;
  terceiroId!: number;
  usuarioEmpresaSolicitanteId!: number;
  centroCustoId!: number;
  descricao!: string;
  valorEstimado!: number;
  dataSolicitacao!: Date;
  status!: string;

  createdAt!: Date;
  updatedAt!: Date;
}
