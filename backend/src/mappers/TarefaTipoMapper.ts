import { BaseMapper } from '@/core/base/BaseMapper';
import { TarefaTipo } from '@/entities/TarefaTipo';
import { CreateTarefaTipoDto, UpdateTarefaTipoDto, TarefaTipoResponseDto } from '@/dtos/TarefaTipoDto';
import { IDto } from '@/core/base/BaseDto';

export class TarefaTipoMapper extends BaseMapper<TarefaTipo> {
  
  toEntity(createDto: IDto): TarefaTipo {
    const dto = createDto as CreateTarefaTipoDto;
    const entity = new TarefaTipo();
    
    entity.empresaId = dto.empresaId as any;
    entity.nome = dto.nome as any;
    entity.gerenteFuncionarioId = dto.gerenteFuncionarioId as any;
    entity.centroCustoId = dto.centroCustoId as any;
    entity.cor = dto.cor as any;
    entity.ativo = dto.ativo as any;
    
    return entity;
  }

  toEntityFromUpdate(updateDto: IDto, existingEntity: TarefaTipo): TarefaTipo {
    const dto = updateDto as UpdateTarefaTipoDto;
    
    
    if (dto.empresaId !== undefined) {
      existingEntity.empresaId = dto.empresaId as any;
    }
    
    if (dto.nome !== undefined) {
      existingEntity.nome = dto.nome as any;
    }
    
    if (dto.gerenteFuncionarioId !== undefined) {
      existingEntity.gerenteFuncionarioId = dto.gerenteFuncionarioId as any;
    }
    
    if (dto.centroCustoId !== undefined) {
      existingEntity.centroCustoId = dto.centroCustoId as any;
    }
    
    if (dto.cor !== undefined) {
      existingEntity.cor = dto.cor as any;
    }
    
    if (dto.ativo !== undefined) {
      existingEntity.ativo = dto.ativo as any;
    }
    
    return existingEntity;
  }

  toResponseDto(entity: TarefaTipo): IDto {
    const responseDto = new TarefaTipoResponseDto();
    
    responseDto.tipoId = entity.tipoId as any;
    responseDto.empresaId = entity.empresaId as any;
    responseDto.nome = entity.nome as any;
    responseDto.gerenteFuncionarioId = entity.gerenteFuncionarioId as any;
    responseDto.centroCustoId = entity.centroCustoId as any;
    responseDto.cor = entity.cor as any;
    responseDto.ativo = entity.ativo as any;
    responseDto.createdAt = entity.createdAt as any;
    responseDto.updatedAt = entity.updatedAt as any;
    
    return responseDto;
  }
}
