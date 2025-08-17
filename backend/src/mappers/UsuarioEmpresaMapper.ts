import { BaseMapper } from '@/core/base/BaseMapper';
import { UsuarioEmpresa } from '@/entities/UsuarioEmpresa';
import { CreateUsuarioEmpresaDto, UpdateUsuarioEmpresaDto, UsuarioEmpresaResponseDto, UsuarioEmpresaWithRelationsResponseDto } from '@/dtos/UsuarioEmpresaDto';
import { EmpresaResponseDto } from '@/dtos/EmpresaDto';
import { RoleResponseDto } from '@/dtos/RoleDto';
import { IDto } from '@/core/base/BaseDto';
import { EmpresaMapper } from '@/mappers/EmpresaMapper';
import { RoleMapper } from '@/mappers/RoleMapper';

export class UsuarioEmpresaMapper extends BaseMapper<UsuarioEmpresa> {
  private empresaMapper: EmpresaMapper;
  private roleMapper: RoleMapper;

  constructor() {
    super();
    this.empresaMapper = new EmpresaMapper();
    this.roleMapper = new RoleMapper();
  }
  
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

  toWithRelationsResponseDto(entity: UsuarioEmpresa): UsuarioEmpresaWithRelationsResponseDto {
    const responseDto = new UsuarioEmpresaWithRelationsResponseDto();
    
    responseDto.usuarioEmpresaId = entity.usuarioEmpresaId as any;
    responseDto.userId = entity.userId as any;
    responseDto.empresaId = entity.empresaId as any;
    responseDto.roleId = entity.roleId as any;
    responseDto.ativo = entity.ativo as any;
    responseDto.createdAt = entity.createdAt as any;
    responseDto.updatedAt = entity.updatedAt as any;
    
    // Map relations
    if (entity.empresa) {
      responseDto.empresa = this.empresaMapper.toResponseDto(entity.empresa) as EmpresaResponseDto;
    }
    
    if (entity.role) {
      responseDto.role = this.roleMapper.toResponseDto(entity.role) as RoleResponseDto;
    }
    
    return responseDto;
  }
}
