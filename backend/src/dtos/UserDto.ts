import { IsNotEmpty, IsString, Length, IsOptional, IsEmail, Matches, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { IDto } from '@/core/base/BaseDto';

// CREATE
export class CreateUserDto implements IDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 255)
  nome!: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password!: string;
}

// UPDATE
export class UpdateUserDto implements IDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(2, 255)
  nome?: string;

  @IsOptional()
  @IsString()
  @Length(6, 100)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password?: string;
}

// RESPONSE
export class UserResponseDto implements IDto {
  @IsInt()
  userId!: number;
  
  @IsEmail()
  email!: string;
  
  @IsString()
  nome!: string;

  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date | null;
  isDeleted!: boolean;
}

