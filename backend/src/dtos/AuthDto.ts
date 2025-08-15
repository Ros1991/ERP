import { IsEmail, IsString, MinLength, IsOptional, IsArray, IsUUID, IsBoolean } from 'class-validator';
import { BaseDto } from './BaseDto';

export class RegisterDto extends BaseDto {
  @IsString({ message: 'Nome é obrigatório' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  name!: string;

  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email!: string;

  @IsString({ message: 'Senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
  password!: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email!: string;

  @IsString({ message: 'Senha é obrigatória' })
  password!: string;
}

export class FacialLoginDto {
  @IsString({ message: 'Dados da imagem são obrigatórios' })
  image_data!: string;
}

export class RegisterFaceDto {
  @IsString({ message: 'Dados da imagem são obrigatórios' })
  image_data!: string;
}

export class RefreshTokenDto {
  @IsString({ message: 'Refresh token é obrigatório' })
  refresh_token!: string;
}

export class ChangePasswordDto {
  @IsString({ message: 'Senha atual é obrigatória' })
  current_password!: string;

  @IsString({ message: 'Nova senha é obrigatória' })
  @MinLength(8, { message: 'Nova senha deve ter pelo menos 8 caracteres' })
  new_password!: string;
}

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email!: string;
}

export class ResetPasswordDto {
  @IsString({ message: 'Token é obrigatório' })
  token!: string;

  @IsString({ message: 'Nova senha é obrigatória' })
  @MinLength(8, { message: 'Nova senha deve ter pelo menos 8 caracteres' })
  new_password!: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email?: string;
}

export class AuthResponseDto {
  access_token!: string;
  refresh_token!: string;
  user!: UserInfoDto;
  companies!: CompanyInfoDto[];
}

export class UserInfoDto {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsBoolean()
  has_facial_recognition!: boolean;

  created_at!: Date;
}

export class CompanyInfoDto {
  @IsUUID()
  company_id!: string;

  @IsString()
  company_name!: string;

  @IsString()
  role_name!: string;

  @IsArray()
  permissions!: string[];
}

export class InviteUserDto {
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email!: string;

  @IsUUID(4, { message: 'ID do perfil deve ser um UUID válido' })
  role_id!: string;

  @IsOptional()
  @IsString({ message: 'Mensagem deve ser uma string' })
  message?: string;
}

export class AcceptInviteDto {
  @IsString({ message: 'Token de convite é obrigatório' })
  invite_token!: string;

  @IsString({ message: 'Nome é obrigatório' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  name!: string;

  @IsString({ message: 'Senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
  password!: string;
}

export class RevokeAccessDto {
  @IsUUID(4, { message: 'ID do usuário deve ser um UUID válido' })
  user_id!: string;

  @IsOptional()
  @IsString({ message: 'Motivo deve ser uma string' })
  reason?: string;
}

