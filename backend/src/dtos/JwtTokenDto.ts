import { IsNotEmpty, IsString, Length, IsOptional, IsEmail, IsInt, IsNumber, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IDto } from '@/core/base/BaseDto';

// CREATE
export class CreateJwtTokenDto implements IDto {
  @IsNotEmpty()
  @IsNumber()
  userId!: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  tokenHash!: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  expirationDate!: Date;

}

// UPDATE
export class UpdateJwtTokenDto implements IDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  tokenHash?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expirationDate?: Date;

}

// RESPONSE
export class JwtTokenResponseDto implements IDto {
  @IsInt()
  tokenId!: number;
  
  userId!: number;
  tokenHash!: string;
  expirationDate!: Date;

  createdAt!: Date;
  updatedAt!: Date;
}
