import { BaseMapper } from '@/core/base/BaseMapper';
import { Conta } from '@/entities/Conta';
import { CreateContaDto, UpdateContaDto, ContaResponseDto } from '@/dtos/ContaDto';
import { IDto } from '@/core/base/BaseDto';

export class ContaMapper extends BaseMapper<Conta> {
  
  toEntity(createDto: IDto): Conta {
    const dto = createDto as CreateContaDto;
    const entity = new Conta();
    
    entity.empresaId = dto.empresaId as any;
    entity.nome = dto.nome as any;
    entity.tipo = dto.tipo as any;
    entity.saldoInicial = dto.saldoInicial as any;
    entity.ativa = dto.ativa as any;
    
    return entity;
  }

  toEntityFromUpdate(updateDto: IDto, existingEntity: Conta): Conta {
    const dto = updateDto as UpdateContaDto;
    
    if (dto.empresaId !== undefined) {
      existingEntity.empresaId = dto.empresaId as any;
    }
    
    if (dto.nome !== undefined) {
      existingEntity.nome = dto.nome as any;
    }
    
    if (dto.tipo !== undefined) {
      existingEntity.tipo = dto.tipo as any;
    }
    
    if (dto.saldoInicial !== undefined) {
      existingEntity.saldoInicial = dto.saldoInicial as any;
    }
    
    if (dto.ativa !== undefined) {
      existingEntity.ativa = dto.ativa as any;
    }
    
    return existingEntity;
  }

  toResponseDto(entity: Conta): IDto {
    const responseDto = new ContaResponseDto();
    
    responseDto.contaId = entity.contaId as any;
    responseDto.empresaId = entity.empresaId as any;
    responseDto.nome = entity.nome as any;
    responseDto.tipo = entity.tipo as any;
    responseDto.saldoInicial = entity.saldoInicial as any;
    responseDto.ativa = entity.ativa as any;
    responseDto.createdAt = entity.createdAt as any;
    responseDto.updatedAt = entity.updatedAt as any;
    
    return responseDto;
  }
}
