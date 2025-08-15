import { BaseMapper } from '@/core/base/BaseMapper';
import { FuncionarioBeneficioDesconto } from '@/entities/FuncionarioBeneficioDesconto';
import { CreateFuncionarioBeneficioDescontoDto, UpdateFuncionarioBeneficioDescontoDto, FuncionarioBeneficioDescontoResponseDto } from '@/dtos/FuncionarioBeneficioDescontoDto';
import { IDto } from '@/core/base/BaseDto';

export class FuncionarioBeneficioDescontoMapper extends BaseMapper<FuncionarioBeneficioDesconto> {
  
  toEntity(createDto: IDto): FuncionarioBeneficioDesconto {
    const dto = createDto as CreateFuncionarioBeneficioDescontoDto;
    const entity = new FuncionarioBeneficioDesconto();
    
    entity.contratoId = dto.contratoId as any;
    entity.tipo = dto.tipo as any;
    entity.nome = dto.nome as any;
    entity.valor = dto.valor as any;
    entity.frequencia = dto.frequencia as any;
    entity.dataInicio = dto.dataInicio as any;
    entity.dataFim = dto.dataFim as any;
    entity.ativo = dto.ativo as any;
    
    return entity;
  }

  toEntityFromUpdate(updateDto: IDto, existingEntity: FuncionarioBeneficioDesconto): FuncionarioBeneficioDesconto {
    const dto = updateDto as UpdateFuncionarioBeneficioDescontoDto;
    
    if (dto.contratoId !== undefined) {
      existingEntity.contratoId = dto.contratoId as any;
    }
    
    if (dto.tipo !== undefined) {
      existingEntity.tipo = dto.tipo as any;
    }
    
    if (dto.nome !== undefined) {
      existingEntity.nome = dto.nome as any;
    }
    
    if (dto.valor !== undefined) {
      existingEntity.valor = dto.valor as any;
    }
    
    if (dto.frequencia !== undefined) {
      existingEntity.frequencia = dto.frequencia as any;
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
    
    return existingEntity;
  }

  toResponseDto(entity: FuncionarioBeneficioDesconto): IDto {
    const responseDto = new FuncionarioBeneficioDescontoResponseDto();
    
    responseDto.beneficioDescontoId = entity.beneficioDescontoId as any;
    responseDto.contratoId = entity.contratoId as any;
    responseDto.tipo = entity.tipo as any;
    responseDto.nome = entity.nome as any;
    responseDto.valor = entity.valor as any;
    responseDto.frequencia = entity.frequencia as any;
    responseDto.dataInicio = entity.dataInicio as any;
    responseDto.dataFim = entity.dataFim as any;
    responseDto.ativo = entity.ativo as any;
    responseDto.createdAt = entity.createdAt as any;
    responseDto.updatedAt = entity.updatedAt as any;
    
    return responseDto;
  }
}
