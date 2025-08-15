import { BaseMapper } from '@/core/base/BaseMapper';
import { User } from '@/entities/User';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '@/dtos/UserDto';
import { IDto } from '@/core/base/BaseDto';

export class UserMapper extends BaseMapper<User> {
  
  toEntity(createDto: IDto): User {
    const dto = createDto as CreateUserDto;
    const user = new User();
    
    user.email = dto.email;
    user.nome = dto.nome;
    user.passwordHash = dto.password; // Will be hashed in service
    
    return user;
  }

  toEntityFromUpdate(updateDto: IDto, existingEntity: User): User {
    const dto = updateDto as UpdateUserDto;
    
    if (dto.email !== undefined) {
      existingEntity.email = dto.email as any;
    }
    
    if (dto.nome !== undefined) {
      existingEntity.nome = dto.nome as any;
    }
    
    if (dto.password !== undefined) {
      existingEntity.passwordHash = dto.password as any; // Will be hashed in service
    }
    
    return existingEntity;
  }

  toResponseDto(entity: User): IDto {
    const responseDto = new UserResponseDto();
    
    responseDto.userId = entity.userId as any;
    responseDto.email = entity.email as any;
    responseDto.nome = entity.nome as any;
    responseDto.createdAt = entity.createdAt as any;
    responseDto.updatedAt = entity.updatedAt as any;
    responseDto.deletedAt = entity.deletedAt as any;
    responseDto.isDeleted = entity.isDeleted as any;
    
    return responseDto;
  }
}

