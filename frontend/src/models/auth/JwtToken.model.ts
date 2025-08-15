export interface JwtToken {
  id: number;
  userId: number;
  token: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}


export interface TokenPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}
