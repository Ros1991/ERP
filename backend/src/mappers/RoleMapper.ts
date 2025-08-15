import { BaseMapper } from '@/core/base/BaseMapper';
import { Role } from '@/entities/Role';
import { CreateRoleDto, UpdateRoleDto, RoleResponseDto } from '@/dtos/RoleDto';
import { IDto } from '@/core/base/BaseDto';

export class RoleMapper extends BaseMapper<Role> {
  
  toEntity(createDto: IDto): Role {
    const dto = createDto as CreateRoleDto;
    const entity = new Role();
    
    entity.empresaId = dto.empresaId as any;
    entity.nome = dto.nome as any;
    entity.permissoes = dto.permissoes as any;
    entity.ativo = dto.ativo as any;
    
    return entity;
  }

  toEntityFromUpdate(updateDto: IDto, existingEntity: Role): Role {
    const dto = updateDto as UpdateRoleDto;
    
    
    if (dto.empresaId !== undefined) {
      existingEntity.empresaId = dto.empresaId as any;
    }
    
    if (dto.nome !== undefined) {
      existingEntity.nome = dto.nome as any;
    }
    
    if (dto.permissoes !== undefined) {
      existingEntity.permissoes = dto.permissoes as any;
    }
    
    if (dto.ativo !== undefined) {
      existingEntity.ativo = dto.ativo as any;
    }
    
    return existingEntity;
  }

  toResponseDto(entity: Role): IDto {
    const responseDto = new RoleResponseDto();
    
    responseDto.roleId = entity.roleId as any;
    responseDto.empresaId = entity.empresaId as any;
    responseDto.nome = entity.nome as any;
    responseDto.permissoes = entity.permissoes as any;
    responseDto.ativo = entity.ativo as any;
    responseDto.createdAt = entity.createdAt as any;
    responseDto.updatedAt = entity.updatedAt as any;
    
    return responseDto;
  }
}
