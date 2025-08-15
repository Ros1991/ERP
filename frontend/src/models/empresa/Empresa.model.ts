export interface Empresa {
  empresaId: number;
  nome: string;
  cnpj?: string;
  razaoSocial?: string;
  ativa: boolean;
  email?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
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
