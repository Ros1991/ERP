import { BaseMapper } from '@/core/base/BaseMapper';
import { UsuarioEmpresa } from '@/entities/UsuarioEmpresa';
import { CreateUsuarioEmpresaDto, UpdateUsuarioEmpresaDto, UsuarioEmpresaResponseDto } from '@/dtos/UsuarioEmpresaDto';
import { IDto } from '@/core/base/BaseDto';

export class UsuarioEmpresaMapper extends BaseMapper<UsuarioEmpresa> {
  
  toEntity(createDto: IDto): UsuarioEmpresa {
    const dto = createDto as CreateUsuarioEmpresaDto;
    const entity = new UsuarioEmpresa();
    
    entity.userId = dto.userId as any;
    entity.empresaId = dto.empresaId as any;
    entity.roleId = dto.roleId as any;
    entity.ativo = dto.ativo as any;
    
    return entity;
  }

  toEntityFromUpdate(updateDto: IDto, existingEntity: UsuarioEmpresa): UsuarioEmpresa {
    const dto = updateDto as UpdateUsuarioEmpresaDto;
    
    
    if (dto.userId !== undefined) {
      existingEntity.userId = dto.userId as any;
    }
    
    if (dto.empresaId !== undefined) {
      existingEntity.empresaId = dto.empresaId as any;
    }
    
    if (dto.roleId !== undefined) {
      existingEntity.roleId = dto.roleId as any;
    }
    
    if (dto.ativo !== undefined) {
      existingEntity.ativo = dto.ativo as any;
    }
    
    return existingEntity;
  }

  toResponseDto(entity: UsuarioEmpresa): IDto {
    const responseDto = new UsuarioEmpresaResponseDto();
    
    responseDto.usuarioEmpresaId = entity.usuarioEmpresaId as any;
    responseDto.userId = entity.userId as any;
    responseDto.empresaId = entity.empresaId as any;
    responseDto.roleId = entity.roleId as any;
    responseDto.ativo = entity.ativo as any;
    responseDto.createdAt = entity.createdAt as any;
    responseDto.updatedAt = entity.updatedAt as any;
    
    return responseDto;
  }
}
