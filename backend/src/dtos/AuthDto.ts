import { IsNotEmpty, IsString, IsEmail, Length, Matches, IsOptional } from 'class-validator';
import { IDto } from '@/core/base/BaseDto';

// LOGIN
export class LoginDto implements IDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}

// FORGOT PASSWORD
export class ForgotPasswordDto implements IDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}

// RESET PASSWORD
export class ResetPasswordDto implements IDto {
  @IsNotEmpty()
  @IsString()
  token!: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  newPassword!: string;
}

// REGISTER
export class RegisterDto implements IDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  nome!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  password!: string;
}

// CHANGE PASSWORD
export class ChangePasswordDto implements IDto {
  @IsNotEmpty()
  @IsString()
  currentPassword!: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  newPassword!: string;
}

// RESPONSE DTOs
export class LoginResponseDto implements IDto {
  user!: {
    userId: number;
    email: string;
    nome: string;
  };
  token!: string;
  expiresIn!: string;
}

export class ForgotPasswordResponseDto implements IDto {
  message!: string;
  success!: boolean;
}

export class ResetPasswordResponseDto implements IDto {
  message!: string;
  success!: boolean;
}
