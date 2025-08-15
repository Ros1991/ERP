export interface Conta {
  id: number;
  empresaId: number;
  nome: string;
  tipo: 'BANCO' | 'CAIXA' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'INVESTIMENTO' | 'OUTROS';
  saldoInicial: number;
  saldoAtual: number;
  banco?: string;
  agencia?: string;
  numeroConta?: string;
  observacoes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContaDTO {
  empresaId: number;
  nome: string;
  tipo: 'BANCO' | 'CAIXA' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'INVESTIMENTO' | 'OUTROS';
  saldoInicial: number;
  banco?: string;
  agencia?: string;
  numeroConta?: string;
  observacoes?: string;
}

export interface UpdateContaDTO extends Partial<CreateContaDTO> {
  saldoAtual?: number;
  isActive?: boolean;
}
