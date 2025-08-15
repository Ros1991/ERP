import { BaseMapper } from '@/core/base/BaseMapper';
import { TransacaoCentroCusto } from '@/entities/TransacaoCentroCusto';
import { CreateTransacaoCentroCustoDto, UpdateTransacaoCentroCustoDto, TransacaoCentroCustoResponseDto } from '@/dtos/TransacaoCentroCustoDto';
import { IDto } from '@/core/base/BaseDto';

export class TransacaoCentroCustoMapper extends BaseMapper<TransacaoCentroCusto> {
  
  toEntity(createDto: IDto): TransacaoCentroCusto {
    const dto = createDto as CreateTransacaoCentroCustoDto;
    const entity = new TransacaoCentroCusto();
    
    entity.transacaoId = dto.transacaoId as any;
    entity.centroCustoId = dto.centroCustoId as any;
    entity.percentual = dto.percentual as any;
    entity.valor = dto.valor as any;
    
    return entity;
  }

  toEntityFromUpdate(updateDto: IDto, existingEntity: TransacaoCentroCusto): TransacaoCentroCusto {
    const dto = updateDto as UpdateTransacaoCentroCustoDto;
    
    if (dto.transacaoId !== undefined) {
      existingEntity.transacaoId = dto.transacaoId as any;
    }
    
    if (dto.centroCustoId !== undefined) {
      existingEntity.centroCustoId = dto.centroCustoId as any;
    }
    
    if (dto.percentual !== undefined) {
      existingEntity.percentual = dto.percentual as any;
    }
    
    if (dto.valor !== undefined) {
      existingEntity.valor = dto.valor as any;
    }
    
    return existingEntity;
  }

  toResponseDto(entity: TransacaoCentroCusto): IDto {
    const responseDto = new TransacaoCentroCustoResponseDto();
    
    responseDto.transacaoCentroCustoId = entity.transacaoCentroCustoId as any;
    responseDto.transacaoId = entity.transacaoId as any;
    responseDto.centroCustoId = entity.centroCustoId as any;
    responseDto.percentual = entity.percentual as any;
    responseDto.valor = entity.valor as any;
    responseDto.createdAt = entity.createdAt as any;
    
    return responseDto;
  }
}
