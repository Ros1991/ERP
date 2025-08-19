export interface Empresa {
  empresaId: number;
  nome: string;
  cnpj?: string;
  razaoSocial?: string;
  ativa: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmpresaDTO {
  nome: string;
  cnpj?: string;
  razaoSocial?: string;
  ativa?: boolean;
}

export interface UpdateEmpresaDTO extends Partial<CreateEmpresaDTO> {
  ativa?: boolean;
}
