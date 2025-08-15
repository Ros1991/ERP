import { BaseMapper } from '@/core/base/BaseMapper';
import { TarefaHistoria } from '@/entities/TarefaHistoria';
import { CreateTarefaHistoriaDto, UpdateTarefaHistoriaDto, TarefaHistoriaResponseDto } from '@/dtos/TarefaHistoriaDto';
import { IDto } from '@/core/base/BaseDto';

export class TarefaHistoriaMapper extends BaseMapper<TarefaHistoria> {
  
  toEntity(createDto: IDto): TarefaHistoria {
    const dto = createDto as CreateTarefaHistoriaDto;
    const entity = new TarefaHistoria();
    
    entity.tarefaId = dto.tarefaId as any;
    entity.usuarioEmpresaId = dto.usuarioEmpresaId as any;
    entity.tipoEvento = dto.tipoEvento as any;
    entity.comentario = dto.comentario as any;
    entity.arquivoUrl = dto.arquivoUrl as any;
    entity.dadosAlterados = dto.dadosAlterados as any;
    
    return entity;
  }

  toEntityFromUpdate(updateDto: IDto, existingEntity: TarefaHistoria): TarefaHistoria {
    const dto = updateDto as UpdateTarefaHistoriaDto;
    
    if (dto.tarefaId !== undefined) {
      existingEntity.tarefaId = dto.tarefaId as any;
    }
    
    if (dto.usuarioEmpresaId !== undefined) {
      existingEntity.usuarioEmpresaId = dto.usuarioEmpresaId as any;
    }
    
    if (dto.tipoEvento !== undefined) {
      existingEntity.tipoEvento = dto.tipoEvento as any;
    }
    
    if (dto.comentario !== undefined) {
      existingEntity.comentario = dto.comentario as any;
    }
    
    if (dto.arquivoUrl !== undefined) {
      existingEntity.arquivoUrl = dto.arquivoUrl as any;
    }
    
    if (dto.dadosAlterados !== undefined) {
      existingEntity.dadosAlterados = dto.dadosAlterados as any;
    }
    
    return existingEntity;
  }

  toResponseDto(entity: TarefaHistoria): IDto {
    const responseDto = new TarefaHistoriaResponseDto();
    
    responseDto.historiaId = entity.historiaId as any;
    responseDto.tarefaId = entity.tarefaId as any;
    responseDto.usuarioEmpresaId = entity.usuarioEmpresaId as any;
    responseDto.tipoEvento = entity.tipoEvento as any;
    responseDto.comentario = entity.comentario as any;
    responseDto.arquivoUrl = entity.arquivoUrl as any;
    responseDto.dadosAlterados = entity.dadosAlterados as any;
    responseDto.createdAt = entity.createdAt as any;
    
    return responseDto;
  }
}
