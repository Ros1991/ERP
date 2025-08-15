import { BaseMapper } from '@/core/base/BaseMapper';
import { PedidoCompra } from '@/entities/PedidoCompra';
import { CreatePedidoCompraDto, UpdatePedidoCompraDto, PedidoCompraResponseDto } from '@/dtos/PedidoCompraDto';
import { IDto } from '@/core/base/BaseDto';

export class PedidoCompraMapper extends BaseMapper<PedidoCompra> {
  
  toEntity(createDto: IDto): PedidoCompra {
    const dto = createDto as CreatePedidoCompraDto;
    const entity = new PedidoCompra();
    
    entity.empresaId = dto.empresaId as any;
    entity.terceiroId = dto.terceiroId as any;
    entity.usuarioEmpresaSolicitanteId = dto.usuarioEmpresaSolicitanteId as any;
    entity.centroCustoId = dto.centroCustoId as any;
    entity.descricao = dto.descricao as any;
    entity.valorEstimado = dto.valorEstimado as any;
    entity.dataSolicitacao = dto.dataSolicitacao as any;
    entity.status = dto.status as any;
    
    return entity;
  }

  toEntityFromUpdate(updateDto: IDto, existingEntity: PedidoCompra): PedidoCompra {
    const dto = updateDto as UpdatePedidoCompraDto;
    
    if (dto.empresaId !== undefined) {
      existingEntity.empresaId = dto.empresaId as any;
    }
    
    if (dto.terceiroId !== undefined) {
      existingEntity.terceiroId = dto.terceiroId as any;
    }
    
    if (dto.usuarioEmpresaSolicitanteId !== undefined) {
      existingEntity.usuarioEmpresaSolicitanteId = dto.usuarioEmpresaSolicitanteId as any;
    }
    
    if (dto.centroCustoId !== undefined) {
      existingEntity.centroCustoId = dto.centroCustoId as any;
    }
    
    if (dto.descricao !== undefined) {
      existingEntity.descricao = dto.descricao as any;
    }
    
    if (dto.valorEstimado !== undefined) {
      existingEntity.valorEstimado = dto.valorEstimado as any;
    }
    
    if (dto.dataSolicitacao !== undefined) {
      existingEntity.dataSolicitacao = dto.dataSolicitacao as any;
    }
    
    if (dto.status !== undefined) {
      existingEntity.status = dto.status as any;
    }
    
    return existingEntity;
  }

  toResponseDto(entity: PedidoCompra): IDto {
    const responseDto = new PedidoCompraResponseDto();
    
    responseDto.pedidoId = entity.pedidoId as any;
    responseDto.empresaId = entity.empresaId as any;
    responseDto.terceiroId = entity.terceiroId as any;
    responseDto.usuarioEmpresaSolicitanteId = entity.usuarioEmpresaSolicitanteId as any;
    responseDto.centroCustoId = entity.centroCustoId as any;
    responseDto.descricao = entity.descricao as any;
    responseDto.valorEstimado = entity.valorEstimado as any;
    responseDto.dataSolicitacao = entity.dataSolicitacao as any;
    responseDto.status = entity.status as any;
    responseDto.createdAt = entity.createdAt as any;
    responseDto.updatedAt = entity.updatedAt as any;
    
    return responseDto;
  }
}
