import type { User } from './User.model';

export interface AuthResponse {
  user: {
    userId: number;
    email: string;
    nome: string;
  };
  token: string;
  expiresIn: string;
}
