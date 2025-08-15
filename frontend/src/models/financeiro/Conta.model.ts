export interface Conta {
  contaId: number;
  empresaId: number;
  tipo: 'SOCIO' | 'EMPRESA' | 'BANCO' | 'CAIXA';
  socioId?: number;
  bancoId?: number;
  nome: string;
  saldo: number;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContaDTO {
  empresaId: number;
  tipo: 'SOCIO' | 'EMPRESA' | 'BANCO' | 'CAIXA';
  socioId?: number;
  bancoId?: number;
  nome: string;
  saldo?: number;
  ativo?: boolean;
}

export interface UpdateContaDTO extends Partial<CreateContaDTO> {}
