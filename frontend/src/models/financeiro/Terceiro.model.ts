export interface Terceiro {
  terceiroId: number;
  empresaId: number;
  tipo: 'CLIENTE' | 'FORNECEDOR' | 'AMBOS';
  tipoPessoa: 'FISICA' | 'JURIDICA';
  nome: string;
  documento: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  observacao?: string;
  ativo: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTerceiroDTO {
  empresaId: number;
  tipo: 'CLIENTE' | 'FORNECEDOR' | 'AMBOS';
  tipoPessoa: 'FISICA' | 'JURIDICA';
  nome: string;
  documento: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  observacao?: string;
  ativo?: boolean;
}

export interface UpdateTerceiroDTO extends Partial<CreateTerceiroDTO> {}
