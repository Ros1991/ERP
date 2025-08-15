export interface Role {
  id: number;
  empresaId: number;
  nome: string;
  descricao?: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: string;
}

export interface UserRole {
  userId: number;
  roleId: number;
  empresaId: number;
  assignedAt: string;
}
