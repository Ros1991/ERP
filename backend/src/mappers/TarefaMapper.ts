import { BaseMapper } from '@/core/base/BaseMapper';
import { Tarefa } from '@/entities/Tarefa';
import { CreateTarefaDto, UpdateTarefaDto, TarefaResponseDto } from '@/dtos/TarefaDto';
import { IDto } from '@/core/base/BaseDto';

export class TarefaMapper extends BaseMapper<Tarefa> {
  
  toEntity(createDto: IDto): Tarefa {
    const dto = createDto as CreateTarefaDto;
    const entity = new Tarefa();
    
    entity.empresaId = dto.empresaId as any;
    entity.tipoId = dto.tipoId as any;
    entity.titulo = dto.titulo as any;
    entity.descricao = dto.descricao as any;
    entity.status = dto.status as any;
    entity.prioridade = dto.prioridade as any;
    entity.dataInicio = dto.dataInicio as any;
    entity.dataPrazo = dto.dataPrazo as any;
    entity.dataConclusao = dto.dataConclusao as any;
    
    return entity;
  }

  toEntityFromUpdate(updateDto: IDto, existingEntity: Tarefa): Tarefa {
    const dto = updateDto as UpdateTarefaDto;
    
    
    if (dto.empresaId !== undefined) {
      existingEntity.empresaId = dto.empresaId as any;
    }
    
    if (dto.tipoId !== undefined) {
      existingEntity.tipoId = dto.tipoId as any;
    }
    
    if (dto.titulo !== undefined) {
      existingEntity.titulo = dto.titulo as any;
    }
    
    if (dto.descricao !== undefined) {
      existingEntity.descricao = dto.descricao as any;
    }
    
    if (dto.status !== undefined) {
      existingEntity.status = dto.status as any;
    }
    
    if (dto.prioridade !== undefined) {
      existingEntity.prioridade = dto.prioridade as any;
    }
    
    if (dto.dataInicio !== undefined) {
      existingEntity.dataInicio = dto.dataInicio as any;
    }
    
    if (dto.dataPrazo !== undefined) {
      existingEntity.dataPrazo = dto.dataPrazo as any;
    }
    
    if (dto.dataConclusao !== undefined) {
      existingEntity.dataConclusao = dto.dataConclusao as any;
    }
    
    return existingEntity;
  }

  toResponseDto(entity: Tarefa): IDto {
    const responseDto = new TarefaResponseDto();
    
    responseDto.tarefaId = entity.tarefaId as any;
    responseDto.empresaId = entity.empresaId as any;
    responseDto.tipoId = entity.tipoId as any;
    responseDto.titulo = entity.titulo as any;
    responseDto.descricao = entity.descricao as any;
    responseDto.status = entity.status as any;
    responseDto.prioridade = entity.prioridade as any;
    responseDto.dataInicio = entity.dataInicio as any;
    responseDto.dataPrazo = entity.dataPrazo as any;
    responseDto.dataConclusao = entity.dataConclusao as any;
    responseDto.createdAt = entity.createdAt as any;
    responseDto.updatedAt = entity.updatedAt as any;
    
    return responseDto;
  }
}
