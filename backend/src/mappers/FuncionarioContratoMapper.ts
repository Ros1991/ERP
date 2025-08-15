import { BaseMapper } from '@/core/base/BaseMapper';
import { FuncionarioContrato } from '@/entities/FuncionarioContrato';
import { CreateFuncionarioContratoDto, UpdateFuncionarioContratoDto, FuncionarioContratoResponseDto } from '@/dtos/FuncionarioContratoDto';
import { IDto } from '@/core/base/BaseDto';

export class FuncionarioContratoMapper extends BaseMapper<FuncionarioContrato> {
  
  toEntity(createDto: IDto): FuncionarioContrato {
    const dto = createDto as CreateFuncionarioContratoDto;
    const entity = new FuncionarioContrato();
    
    entity.funcionarioId = dto.funcionarioId as any;
    entity.tipoContrato = dto.tipoContrato as any;
    entity.tipoPagamento = dto.tipoPagamento as any;
    entity.formaPagamento = dto.formaPagamento as any;
    entity.salario = dto.salario as any;
    entity.cargaHorariaSemanal = dto.cargaHorariaSemanal as any;
    entity.dataInicio = dto.dataInicio as any;
    entity.dataFim = dto.dataFim as any;
    entity.ativo = dto.ativo as any;
    entity.observacoes = dto.observacoes as any;
    
    return entity;
  }

  toEntityFromUpdate(updateDto: IDto, existingEntity: FuncionarioContrato): FuncionarioContrato {
    const dto = updateDto as UpdateFuncionarioContratoDto;
    
    
    if (dto.funcionarioId !== undefined) {
      existingEntity.funcionarioId = dto.funcionarioId as any;
    }
    
    if (dto.tipoContrato !== undefined) {
      existingEntity.tipoContrato = dto.tipoContrato as any;
    }
    
    if (dto.tipoPagamento !== undefined) {
      existingEntity.tipoPagamento = dto.tipoPagamento as any;
    }
    
    if (dto.formaPagamento !== undefined) {
      existingEntity.formaPagamento = dto.formaPagamento as any;
    }
    
    if (dto.salario !== undefined) {
      existingEntity.salario = dto.salario as any;
    }
    
    if (dto.cargaHorariaSemanal !== undefined) {
      existingEntity.cargaHorariaSemanal = dto.cargaHorariaSemanal as any;
    }
    
    if (dto.dataInicio !== undefined) {
      existingEntity.dataInicio = dto.dataInicio as any;
    }
    
    if (dto.dataFim !== undefined) {
      existingEntity.dataFim = dto.dataFim as any;
    }
    
    if (dto.ativo !== undefined) {
      existingEntity.ativo = dto.ativo as any;
    }
    
    if (dto.observacoes !== undefined) {
      existingEntity.observacoes = dto.observacoes as any;
    }
    
    return existingEntity;
  }

  toResponseDto(entity: FuncionarioContrato): IDto {
    const responseDto = new FuncionarioContratoResponseDto();
    
    responseDto.contratoId = entity.contratoId as any;
    responseDto.funcionarioId = entity.funcionarioId as any;
    responseDto.tipoContrato = entity.tipoContrato as any;
    responseDto.tipoPagamento = entity.tipoPagamento as any;
    responseDto.formaPagamento = entity.formaPagamento as any;
    responseDto.salario = entity.salario as any;
    responseDto.cargaHorariaSemanal = entity.cargaHorariaSemanal as any;
    responseDto.dataInicio = entity.dataInicio as any;
    responseDto.dataFim = entity.dataFim as any;
    responseDto.ativo = entity.ativo as any;
    responseDto.observacoes = entity.observacoes as any;
    responseDto.createdAt = entity.createdAt as any;
    responseDto.updatedAt = entity.updatedAt as any;
    
    return responseDto;
  }
}
