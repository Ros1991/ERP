import { IsOptional, IsString, IsNumber, IsBoolean, IsDate, IsUUID, IsEnum, IsArray, ValidateNested, IsEmail, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class BaseDto {
  @IsOptional()
  @IsUUID()
  id?: string;
}

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Página deve ser um número' })
  @Min(1, { message: 'Página deve ser maior que 0' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limite deve ser um número' })
  @Min(1, { message: 'Limite deve ser maior que 0' })
  @Max(100, { message: 'Limite não pode ser maior que 100' })
  limit?: number;

  @IsOptional()
  @IsString({ message: 'Campo de ordenação deve ser uma string' })
  sortBy?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'Ordem deve ser ASC ou DESC' })
  sortOrder?: 'ASC' | 'DESC';
}

export class FilterDto extends PaginationDto {
  @IsOptional()
  @IsString({ message: 'Termo de busca deve ser uma string' })
  search?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  })
  @IsDate({ message: 'Data inicial deve ser uma data válida' })
  startDate?: Date;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  })
  @IsDate({ message: 'Data final deve ser uma data válida' })
  endDate?: Date;
}

export class IdParamDto {
  @IsUUID(4, { message: 'ID deve ser um UUID válido' })
  id!: string;
}

export class CompanyIdParamDto {
  @IsUUID(4, { message: 'ID da empresa deve ser um UUID válido' })
  companyId!: string;
}

export class CreateResponseDto {
  @IsUUID()
  id!: string;

  @IsString()
  message!: string;
}

export class UpdateResponseDto {
  @IsUUID()
  id!: string;

  @IsString()
  message!: string;
}

export class DeleteResponseDto {
  @IsString()
  message!: string;
}

export class BulkOperationDto {
  @IsArray({ message: 'IDs deve ser um array' })
  @IsUUID(4, { each: true, message: 'Cada ID deve ser um UUID válido' })
  ids!: string[];
}

export class StatusDto {
  @IsString({ message: 'Status deve ser uma string' })
  status!: string;
}

export class EmailDto {
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email!: string;
}

export class PasswordDto {
  @IsString({ message: 'Senha deve ser uma string' })
  password!: string;
}

export class NameDto {
  @IsString({ message: 'Nome deve ser uma string' })
  name!: string;
}

export class DescriptionDto {
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;
}

export class AmountDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor deve ser um número com até 2 casas decimais' })
  @Min(0, { message: 'Valor deve ser maior ou igual a zero' })
  amount!: number;
}

export class DateRangeDto {
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  })
  @IsDate({ message: 'Data inicial deve ser uma data válida' })
  startDate!: Date;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  })
  @IsDate({ message: 'Data final deve ser uma data válida' })
  endDate!: Date;
}

export class FileUploadDto {
  @IsString({ message: 'URL do arquivo deve ser uma string' })
  fileUrl!: string;

  @IsString({ message: 'Nome do arquivo deve ser uma string' })
  fileName!: string;

  @IsString({ message: 'Tipo do arquivo deve ser uma string' })
  fileType!: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;
}

