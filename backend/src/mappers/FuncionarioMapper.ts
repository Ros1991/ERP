import { BaseMapper } from '@/core/base/BaseMapper';
import { Funcionario } from '@/entities/Funcionario';
import { CreateFuncionarioDto, UpdateFuncionarioDto, FuncionarioResponseDto } from '@/dtos/FuncionarioDto';
import { IDto } from '@/core/base/BaseDto';

export class FuncionarioMapper extends BaseMapper<Funcionario> {
  
  toEntity(createDto: IDto): Funcionario {
    const dto = createDto as CreateFuncionarioDto;
    const entity = new Funcionario();
    
    entity.empresaId = dto.empresaId as any;
    entity.usuarioEmpresaId = dto.usuarioEmpresaId as any;
    entity.nome = dto.nome as any;
    entity.apelido = dto.apelido as any;
    entity.cpf = dto.cpf as any;
    entity.rg = dto.rg as any;
    entity.dataNascimento = dto.dataNascimento as any;
    entity.endereco = dto.endereco as any;
    entity.telefone = dto.telefone as any;
    entity.email = dto.email as any;
    entity.ativo = dto.ativo as any;
    
    return entity;
  }

  toEntityFromUpdate(updateDto: IDto, existingEntity: Funcionario): Funcionario {
    const dto = updateDto as UpdateFuncionarioDto;
    
    
    if (dto.empresaId !== undefined) {
      existingEntity.empresaId = dto.empresaId as any;
    }
    
    if (dto.usuarioEmpresaId !== undefined) {
      existingEntity.usuarioEmpresaId = dto.usuarioEmpresaId as any;
    }
    
    if (dto.nome !== undefined) {
      existingEntity.nome = dto.nome as any;
    }
    
    if (dto.apelido !== undefined) {
      existingEntity.apelido = dto.apelido as any;
    }
    
    if (dto.cpf !== undefined) {
      existingEntity.cpf = dto.cpf as any;
    }
    
    if (dto.rg !== undefined) {
      existingEntity.rg = dto.rg as any;
    }
    
    if (dto.dataNascimento !== undefined) {
      existingEntity.dataNascimento = dto.dataNascimento as any;
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

  toResponseDto(entity: Funcionario): IDto {
    const responseDto = new FuncionarioResponseDto();
    
    responseDto.funcionarioId = entity.funcionarioId as any;
    responseDto.empresaId = entity.empresaId as any;
    responseDto.usuarioEmpresaId = entity.usuarioEmpresaId as any;
    responseDto.nome = entity.nome as any;
    responseDto.apelido = entity.apelido as any;
    responseDto.cpf = entity.cpf as any;
    responseDto.rg = entity.rg as any;
    responseDto.dataNascimento = entity.dataNascimento as any;
    responseDto.endereco = entity.endereco as any;
    responseDto.telefone = entity.telefone as any;
    responseDto.email = entity.email as any;
    responseDto.ativo = entity.ativo as any;
    responseDto.createdAt = entity.createdAt as any;
    responseDto.updatedAt = entity.updatedAt as any;
    
    return responseDto;
  }
}
