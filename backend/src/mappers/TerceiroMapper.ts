import { BaseMapper } from '@/core/base/BaseMapper';
import { Terceiro } from '@/entities/Terceiro';
import { CreateTerceiroDto, UpdateTerceiroDto, TerceiroResponseDto } from '@/dtos/TerceiroDto';
import { IDto } from '@/core/base/BaseDto';

export class TerceiroMapper extends BaseMapper<Terceiro> {
  
  toEntity(createDto: IDto): Terceiro {
    const dto = createDto as CreateTerceiroDto;
    const entity = new Terceiro();
    
    entity.empresaId = dto.empresaId as any;
    entity.nome = dto.nome as any;
    entity.tipo = dto.tipo as any;
    entity.cnpjCpf = dto.cnpjCpf as any;
    entity.endereco = dto.endereco as any;
    entity.telefone = dto.telefone as any;
    entity.email = dto.email as any;
    entity.ativo = dto.ativo as any;
    
    return entity;
  }

  toEntityFromUpdate(updateDto: IDto, existingEntity: Terceiro): Terceiro {
    const dto = updateDto as UpdateTerceiroDto;
    
    
    if (dto.empresaId !== undefined) {
      existingEntity.empresaId = dto.empresaId as any;
    }
    
    if (dto.nome !== undefined) {
      existingEntity.nome = dto.nome as any;
    }
    
    if (dto.tipo !== undefined) {
      existingEntity.tipo = dto.tipo as any;
    }
    
    if (dto.cnpjCpf !== undefined) {
      existingEntity.cnpjCpf = dto.cnpjCpf as any;
    }
    
    if (dto.endereco !== undefined) {
      existingEntity.endereco = dto.endereco as any;
    }
    
    if (dto.telefone !== undefined) {
      existingEntity.telefone = dto.telefone as any;
    }
    
    if (dto.email !== undefined) {
      existingEntity.email = dto.email as any;
    }
    
    if (dto.ativo !== undefined) {
      existingEntity.ativo = dto.ativo as any;
    }
    
    return existingEntity;
  }

  toResponseDto(entity: Terceiro): IDto {
    const responseDto = new TerceiroResponseDto();
    
    responseDto.terceiroId = entity.terceiroId as any;
    responseDto.empresaId = entity.empresaId as any;
    responseDto.nome = entity.nome as any;
    responseDto.tipo = entity.tipo as any;
    responseDto.cnpjCpf = entity.cnpjCpf as any;
    responseDto.endereco = entity.endereco as any;
    responseDto.telefone = entity.telefone as any;
    responseDto.email = entity.email as any;
    responseDto.ativo = entity.ativo as any;
    responseDto.createdAt = entity.createdAt as any;
    responseDto.updatedAt = entity.updatedAt as any;
    
    return responseDto;
  }
}
