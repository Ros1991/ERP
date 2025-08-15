import { BaseMapper } from '@/core/base/BaseMapper';
import { Emprestimo } from '@/entities/Emprestimo';
import { CreateEmprestimoDto, UpdateEmprestimoDto, EmprestimoResponseDto } from '@/dtos/EmprestimoDto';
import { IDto } from '@/core/base/BaseDto';

export class EmprestimoMapper extends BaseMapper<Emprestimo> {
  
  toEntity(createDto: IDto): Emprestimo {
    const dto = createDto as CreateEmprestimoDto;
    const entity = new Emprestimo();
    
    entity.empresaId = dto.empresaId as any;
    entity.funcionarioId = dto.funcionarioId as any;
    entity.valorTotal = dto.valorTotal as any;
    entity.valorPago = dto.valorPago as any;
    entity.valorPendente = dto.valorPendente as any;
    entity.totalParcelas = dto.totalParcelas as any;
    entity.parcelasPagas = dto.parcelasPagas as any;
    entity.quandoCobrar = dto.quandoCobrar as any;
    entity.dataEmprestimo = dto.dataEmprestimo as any;
    entity.dataInicioCobranca = dto.dataInicioCobranca as any;
    entity.status = dto.status as any;
    entity.observacoes = dto.observacoes as any;
    
    return entity;
  }

  toEntityFromUpdate(updateDto: IDto, existingEntity: Emprestimo): Emprestimo {
    const dto = updateDto as UpdateEmprestimoDto;
    
    if (dto.empresaId !== undefined) {
      existingEntity.empresaId = dto.empresaId as any;
    }
    
    if (dto.funcionarioId !== undefined) {
      existingEntity.funcionarioId = dto.funcionarioId as any;
    }
    
    if (dto.valorTotal !== undefined) {
      existingEntity.valorTotal = dto.valorTotal as any;
    }
    
    if (dto.valorPago !== undefined) {
      existingEntity.valorPago = dto.valorPago as any;
    }
    
    if (dto.valorPendente !== undefined) {
      existingEntity.valorPendente = dto.valorPendente as any;
    }
    
    if (dto.totalParcelas !== undefined) {
      existingEntity.totalParcelas = dto.totalParcelas as any;
    }
    
    if (dto.parcelasPagas !== undefined) {
      existingEntity.parcelasPagas = dto.parcelasPagas as any;
    }
    
    if (dto.quandoCobrar !== undefined) {
      existingEntity.quandoCobrar = dto.quandoCobrar as any;
    }
    
    if (dto.dataEmprestimo !== undefined) {
      existingEntity.dataEmprestimo = dto.dataEmprestimo as any;
    }
    
    if (dto.dataInicioCobranca !== undefined) {
      existingEntity.dataInicioCobranca = dto.dataInicioCobranca as any;
    }
    
    if (dto.status !== undefined) {
      existingEntity.status = dto.status as any;
    }
    
    if (dto.observacoes !== undefined) {
      existingEntity.observacoes = dto.observacoes as any;
    }
    
    return existingEntity;
  }

  toResponseDto(entity: Emprestimo): IDto {
    const responseDto = new EmprestimoResponseDto();
    
    responseDto.emprestimoId = entity.emprestimoId as any;
    responseDto.empresaId = entity.empresaId as any;
    responseDto.funcionarioId = entity.funcionarioId as any;
    responseDto.valorTotal = entity.valorTotal as any;
    responseDto.valorPago = entity.valorPago as any;
    responseDto.valorPendente = entity.valorPendente as any;
    responseDto.totalParcelas = entity.totalParcelas as any;
    responseDto.parcelasPagas = entity.parcelasPagas as any;
    responseDto.quandoCobrar = entity.quandoCobrar as any;
    responseDto.dataEmprestimo = entity.dataEmprestimo as any;
    responseDto.dataInicioCobranca = entity.dataInicioCobranca as any;
    responseDto.status = entity.status as any;
    responseDto.observacoes = entity.observacoes as any;
    responseDto.createdAt = entity.createdAt as any;
    responseDto.updatedAt = entity.updatedAt as any;
    
    return responseDto;
  }
}
