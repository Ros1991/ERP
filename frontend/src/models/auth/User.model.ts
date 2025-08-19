export interface User {
  userId: number;
  email: string;
  nome: string;
  passwordHash: string;
  resetTokenHash?: string;
  resetTokenExpires?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  isDeleted: boolean;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  nome: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateUserCredentials {
  nome?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}
