import { BaseMapper } from '@/core/base/BaseMapper';
import { CentroCusto } from '@/entities/CentroCusto';
import { CreateCentroCustoDto, UpdateCentroCustoDto, CentroCustoResponseDto } from '@/dtos/CentroCustoDto';
import { IDto } from '@/core/base/BaseDto';

export class CentroCustoMapper extends BaseMapper<CentroCusto> {
  
  toEntity(createDto: IDto): CentroCusto {
    const dto = createDto as CreateCentroCustoDto;
    const entity = new CentroCusto();
    
    entity.empresaId = dto.empresaId as any;
    entity.nome = dto.nome as any;
    entity.descricao = dto.descricao as any;
    entity.ativo = dto.ativo as any;
    
    return entity;
  }

  toEntityFromUpdate(updateDto: IDto, existingEntity: CentroCusto): CentroCusto {
    const dto = updateDto as UpdateCentroCustoDto;
    
    
    if (dto.empresaId !== undefined) {
      existingEntity.empresaId = dto.empresaId as any;
    }
    
    if (dto.nome !== undefined) {
      existingEntity.nome = dto.nome as any;
    }
    
    if (dto.descricao !== undefined) {
      existingEntity.descricao = dto.descricao as any;
    }
    
    if (dto.ativo !== undefined) {
      existingEntity.ativo = dto.ativo as any;
    }
    
    return existingEntity;
  }

  toResponseDto(entity: CentroCusto): IDto {
    const responseDto = new CentroCustoResponseDto();
    
    responseDto.centroCustoId = entity.centroCustoId as any;
    responseDto.empresaId = entity.empresaId as any;
    responseDto.nome = entity.nome as any;
    responseDto.descricao = entity.descricao as any;
    responseDto.ativo = entity.ativo as any;
    responseDto.createdAt = entity.createdAt as any;
    responseDto.updatedAt = entity.updatedAt as any;
    
    return responseDto;
  }
}
