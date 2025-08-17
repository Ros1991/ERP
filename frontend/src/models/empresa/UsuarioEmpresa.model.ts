import type { Empresa } from "./Empresa.model";
import type { Role } from "../auth/Role.model";

export interface UsuarioEmpresa {
  id: number;
  userId: number;
  empresaId: number;
  cargo?: string;
  departamento?: string;
  dataAdmissao?: string;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  empresa?: Empresa;
  role?: Role;
}

export interface CreateUsuarioEmpresaDTO {
  userId: number;
  empresaId: number;
  cargo?: string;
  departamento?: string;
  dataAdmissao?: string;
  isAdmin?: boolean;
}

export interface UpdateUsuarioEmpresaDTO {
  cargo?: string;
  departamento?: string;
  dataAdmissao?: string;
  isAdmin?: boolean;
  isActive?: boolean;
}
