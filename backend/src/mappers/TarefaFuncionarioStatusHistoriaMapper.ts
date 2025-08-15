import { BaseMapper } from '@/core/base/BaseMapper';
import { TarefaFuncionarioStatusHistoria } from '@/entities/TarefaFuncionarioStatusHistoria';
import { CreateTarefaFuncionarioStatusHistoriaDto, UpdateTarefaFuncionarioStatusHistoriaDto, TarefaFuncionarioStatusHistoriaResponseDto } from '@/dtos/TarefaFuncionarioStatusHistoriaDto';
import { IDto } from '@/core/base/BaseDto';

export class TarefaFuncionarioStatusHistoriaMapper extends BaseMapper<TarefaFuncionarioStatusHistoria> {
  
  toEntity(createDto: IDto): TarefaFuncionarioStatusHistoria {
    const dto = createDto as CreateTarefaFuncionarioStatusHistoriaDto;
    const entity = new TarefaFuncionarioStatusHistoria();
    
    entity.statusId = dto.statusId as any;
    entity.statusAnterior = dto.statusAnterior as any;
    entity.statusNovo = dto.statusNovo as any;
    entity.tempoSessaoMinutos = dto.tempoSessaoMinutos as any;
    entity.motivo = dto.motivo as any;
    
    return entity;
  }

  toEntityFromUpdate(updateDto: IDto, existingEntity: TarefaFuncionarioStatusHistoria): TarefaFuncionarioStatusHistoria {
    const dto = updateDto as UpdateTarefaFuncionarioStatusHistoriaDto;
    
    if (dto.statusId !== undefined) {
      existingEntity.statusId = dto.statusId as any;
    }
    
    if (dto.statusAnterior !== undefined) {
      existingEntity.statusAnterior = dto.statusAnterior as any;
    }
    
    if (dto.statusNovo !== undefined) {
      existingEntity.statusNovo = dto.statusNovo as any;
    }
    
    if (dto.tempoSessaoMinutos !== undefined) {
      existingEntity.tempoSessaoMinutos = dto.tempoSessaoMinutos as any;
    }
    
    if (dto.motivo !== undefined) {
      existingEntity.motivo = dto.motivo as any;
    }
    
    return existingEntity;
  }

  toResponseDto(entity: TarefaFuncionarioStatusHistoria): IDto {
    const responseDto = new TarefaFuncionarioStatusHistoriaResponseDto();
    
    responseDto.historiaStatusId = entity.historiaStatusId as any;
    responseDto.statusId = entity.statusId as any;
    responseDto.statusAnterior = entity.statusAnterior as any;
    responseDto.statusNovo = entity.statusNovo as any;
    responseDto.tempoSessaoMinutos = entity.tempoSessaoMinutos as any;
    responseDto.motivo = entity.motivo as any;
    responseDto.createdAt = entity.createdAt as any;
    
    return responseDto;
  }
}
