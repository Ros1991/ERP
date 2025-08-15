import { BaseMapper } from '@/core/base/BaseMapper';
import { TransacaoFinanceira } from '@/entities/TransacaoFinanceira';
import { CreateTransacaoFinanceiraDto, UpdateTransacaoFinanceiraDto, TransacaoFinanceiraResponseDto } from '@/dtos/TransacaoFinanceiraDto';
import { IDto } from '@/core/base/BaseDto';

export class TransacaoFinanceiraMapper extends BaseMapper<TransacaoFinanceira> {
  
  toEntity(createDto: IDto): TransacaoFinanceira {
    const dto = createDto as CreateTransacaoFinanceiraDto;
    const entity = new TransacaoFinanceira();
    
    entity.empresaId = dto.empresaId as any;
    entity.tipo = dto.tipo as any;
    entity.terceiroId = dto.terceiroId as any;
    entity.descricao = dto.descricao as any;
    entity.valor = dto.valor as any;
    entity.dataTransacao = dto.dataTransacao as any;
    entity.dataVencimento = dto.dataVencimento as any;
    entity.status = dto.status as any;
    entity.observacoes = dto.observacoes as any;
    
    return entity;
  }

  toEntityFromUpdate(updateDto: IDto, existingEntity: TransacaoFinanceira): TransacaoFinanceira {
    const dto = updateDto as UpdateTransacaoFinanceiraDto;
    
    
    if (dto.empresaId !== undefined) {
      existingEntity.empresaId = dto.empresaId as any;
    }
    
    if (dto.tipo !== undefined) {
      existingEntity.tipo = dto.tipo as any;
    }
    
    if (dto.terceiroId !== undefined) {
      existingEntity.terceiroId = dto.terceiroId as any;
    }
    
    if (dto.descricao !== undefined) {
      existingEntity.descricao = dto.descricao as any;
    }
    
    if (dto.valor !== undefined) {
      existingEntity.valor = dto.valor as any;
    }
    
    if (dto.dataTransacao !== undefined) {
      existingEntity.dataTransacao = dto.dataTransacao as any;
    }
    
    if (dto.dataVencimento !== undefined) {
      existingEntity.dataVencimento = dto.dataVencimento as any;
    }
    
    if (dto.status !== undefined) {
      existingEntity.status = dto.status as any;
    }
    
    if (dto.observacoes !== undefined) {
      existingEntity.observacoes = dto.observacoes as any;
    }
    
    return existingEntity;
  }

  toResponseDto(entity: TransacaoFinanceira): IDto {
    const responseDto = new TransacaoFinanceiraResponseDto();
    
    responseDto.transacaoId = entity.transacaoId as any;
    responseDto.empresaId = entity.empresaId as any;
    responseDto.tipo = entity.tipo as any;
    responseDto.contaId = entity.contaId as any;
    responseDto.terceiroId = entity.terceiroId as any;
    responseDto.descricao = entity.descricao as any;
    responseDto.valor = entity.valor as any;
    responseDto.dataTransacao = entity.dataTransacao as any;
    responseDto.dataVencimento = entity.dataVencimento as any;
    responseDto.status = entity.status as any;
    responseDto.observacoes = entity.observacoes as any;
    responseDto.createdAt = entity.createdAt as any;
    responseDto.updatedAt = entity.updatedAt as any;
    
    return responseDto;
  }
}
