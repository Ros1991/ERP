export interface Terceiro {
  id: number;
  empresaId: number;
  tipo: 'CLIENTE' | 'FORNECEDOR' | 'AMBOS';
  tipoPessoa: 'FISICA' | 'JURIDICA';
  nome: string;
  cpfCnpj: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTerceiroDTO {
  empresaId: number;
  tipo: 'CLIENTE' | 'FORNECEDOR' | 'AMBOS';
  tipoPessoa: 'FISICA' | 'JURIDICA';
  nome: string;
  cpfCnpj: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoes?: string;
}

export interface UpdateTerceiroDTO extends Partial<CreateTerceiroDTO> {
  isActive?: boolean;
}
