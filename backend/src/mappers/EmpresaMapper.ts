import { BaseMapper } from '@/core/base/BaseMapper';
import { Empresa } from '@/entities/Empresa';
import { CreateEmpresaDto, UpdateEmpresaDto, EmpresaResponseDto } from '@/dtos/EmpresaDto';
import { IDto } from '@/core/base/BaseDto';

export class EmpresaMapper extends BaseMapper<Empresa> {
  
  toEntity(createDto: IDto): Empresa {
    const dto = createDto as CreateEmpresaDto;
    const entity = new Empresa();
    
    entity.nome = dto.nome as any;
    entity.cnpj = dto.cnpj as any;
    entity.razaoSocial = dto.razaoSocial as any;
    entity.ativa = dto.ativa as any;
    
    return entity;
  }

  toEntityFromUpdate(updateDto: IDto, existingEntity: Empresa): Empresa {
    const dto = updateDto as UpdateEmpresaDto;
    
    
    if (dto.nome !== undefined) {
      existingEntity.nome = dto.nome as any;
    }
    
    if (dto.cnpj !== undefined) {
      existingEntity.cnpj = dto.cnpj as any;
    }
    
    if (dto.razaoSocial !== undefined) {
      existingEntity.razaoSocial = dto.razaoSocial as any;
    }
    
    if (dto.ativa !== undefined) {
      existingEntity.ativa = dto.ativa as any;
    }
    
    return existingEntity;
  }

  toResponseDto(entity: Empresa): IDto {
    const responseDto = new EmpresaResponseDto();
    
    responseDto.empresaId = entity.empresaId as any;
    responseDto.nome = entity.nome as any;
    responseDto.cnpj = entity.cnpj as any;
    responseDto.razaoSocial = entity.razaoSocial as any;
    responseDto.ativa = entity.ativa as any;
    responseDto.createdAt = entity.createdAt as any;
    responseDto.updatedAt = entity.updatedAt as any;
    
    return responseDto;
  }
}
