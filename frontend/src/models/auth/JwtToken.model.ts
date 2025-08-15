export interface JwtToken {
  id: number;
  userId: number;
  token: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    nome: string;
  };
  token: string;
  expiresAt: string;
}

export interface TokenPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}
