import { BaseMapper } from '@/core/base/BaseMapper';
import { TarefaFuncionarioStatus } from '@/entities/TarefaFuncionarioStatus';
import { CreateTarefaFuncionarioStatusDto, UpdateTarefaFuncionarioStatusDto, TarefaFuncionarioStatusResponseDto } from '@/dtos/TarefaFuncionarioStatusDto';
import { IDto } from '@/core/base/BaseDto';

export class TarefaFuncionarioStatusMapper extends BaseMapper<TarefaFuncionarioStatus> {
  
  toEntity(createDto: IDto): TarefaFuncionarioStatus {
    const dto = createDto as CreateTarefaFuncionarioStatusDto;
    const entity = new TarefaFuncionarioStatus();
    
    entity.tarefaId = dto.tarefaId as any;
    entity.funcionarioId = dto.funcionarioId as any;
    entity.status = dto.status as any;
    entity.tempoGastoMinutos = dto.tempoGastoMinutos as any;
    entity.dataAtribuicao = dto.dataAtribuicao as any;
    entity.dataInicio = dto.dataInicio as any;
    entity.dataConclusao = dto.dataConclusao as any;
    entity.observacoesFuncionario = dto.observacoesFuncionario as any;
    
    return entity;
  }

  toEntityFromUpdate(updateDto: IDto, existingEntity: TarefaFuncionarioStatus): TarefaFuncionarioStatus {
    const dto = updateDto as UpdateTarefaFuncionarioStatusDto;
    
    
    if (dto.tarefaId !== undefined) {
      existingEntity.tarefaId = dto.tarefaId as any;
    }
    
    if (dto.funcionarioId !== undefined) {
      existingEntity.funcionarioId = dto.funcionarioId as any;
    }
    
    if (dto.status !== undefined) {
      existingEntity.status = dto.status as any;
    }
    
    if (dto.tempoGastoMinutos !== undefined) {
      existingEntity.tempoGastoMinutos = dto.tempoGastoMinutos as any;
    }
    
    if (dto.dataAtribuicao !== undefined) {
      existingEntity.dataAtribuicao = dto.dataAtribuicao as any;
    }
    
    if (dto.dataInicio !== undefined) {
      existingEntity.dataInicio = dto.dataInicio as any;
    }
    
    if (dto.dataConclusao !== undefined) {
      existingEntity.dataConclusao = dto.dataConclusao as any;
    }
    
    if (dto.observacoesFuncionario !== undefined) {
      existingEntity.observacoesFuncionario = dto.observacoesFuncionario as any;
    }
    
    return existingEntity;
  }

  toResponseDto(entity: TarefaFuncionarioStatus): IDto {
    const responseDto = new TarefaFuncionarioStatusResponseDto();
    
    responseDto.statusId = entity.statusId as any;
    responseDto.tarefaId = entity.tarefaId as any;
    responseDto.funcionarioId = entity.funcionarioId as any;
    responseDto.status = entity.status as any;
    responseDto.tempoGastoMinutos = entity.tempoGastoMinutos as any;
    responseDto.dataAtribuicao = entity.dataAtribuicao as any;
    responseDto.dataInicio = entity.dataInicio as any;
    responseDto.dataConclusao = entity.dataConclusao as any;
    responseDto.observacoesFuncionario = entity.observacoesFuncionario as any;
    responseDto.createdAt = entity.createdAt as any;
    responseDto.updatedAt = entity.updatedAt as any;
    
    return responseDto;
  }
}
