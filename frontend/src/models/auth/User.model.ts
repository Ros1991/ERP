export interface User {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
  empresaId?: string;
  roles?: string[];
  createdAt: string;
  updatedAt: string;
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
