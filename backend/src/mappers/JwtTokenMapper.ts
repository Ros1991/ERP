import { BaseMapper } from '@/core/base/BaseMapper';
import { JwtToken } from '@/entities/JwtToken';
import { CreateJwtTokenDto, UpdateJwtTokenDto, JwtTokenResponseDto } from '@/dtos/JwtTokenDto';
import { IDto } from '@/core/base/BaseDto';

export class JwtTokenMapper extends BaseMapper<JwtToken> {
  
  toEntity(createDto: IDto): JwtToken {
    const dto = createDto as CreateJwtTokenDto;
    const entity = new JwtToken();
    
    entity.userId = dto.userId as any;
    entity.tokenHash = dto.tokenHash as any;
    entity.expirationDate = dto.expirationDate as any;
    
    return entity;
  }

  toEntityFromUpdate(updateDto: IDto, existingEntity: JwtToken): JwtToken {
    const dto = updateDto as UpdateJwtTokenDto;
    
    if (dto.userId !== undefined) {
      existingEntity.userId = dto.userId as any;
    }
    
    if (dto.tokenHash !== undefined) {
      existingEntity.tokenHash = dto.tokenHash as any;
    }
    
    if (dto.expirationDate !== undefined) {
      existingEntity.expirationDate = dto.expirationDate as any;
    }
    
    return existingEntity;
  }

  toResponseDto(entity: JwtToken): IDto {
    const responseDto = new JwtTokenResponseDto();
    
    responseDto.tokenId = entity.tokenId as any;
    responseDto.userId = entity.userId as any;
    responseDto.tokenHash = entity.tokenHash as any;
    responseDto.expirationDate = entity.expirationDate as any;
    responseDto.createdAt = entity.createdAt as any;
    
    return responseDto;
  }
}
