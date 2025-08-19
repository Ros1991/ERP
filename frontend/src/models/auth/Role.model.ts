export interface Role {
  roleId: number;
  empresaId: number;
  nome: string;
  permissoes?: any;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  isDeleted: boolean;
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
