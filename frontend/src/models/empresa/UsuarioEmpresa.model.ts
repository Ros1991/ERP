import type { Empresa } from "./Empresa.model";
import type { Role } from "../auth/Role.model";

export interface UsuarioEmpresa {
  usuarioEmpresaId: number;
  userId: number;
  empresaId: number;
  roleId?: number;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;

  empresa?: Empresa;
  role?: Role;
}

export interface CreateUsuarioEmpresaDTO {
  userId: number;
  empresaId: number;
  roleId?: number;
  ativo?: boolean;
}

export interface UpdateUsuarioEmpresaDTO {
  roleId?: number;
  ativo?: boolean;
}
