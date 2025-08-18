export interface Conta {
  contaId: number;
  empresaId: number;
  tipo: 'SOCIO' | 'EMPRESA' | 'BANCO' | 'CAIXA';
  nome: string;
  saldoInicial: number;
  ativa: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContaDTO {
  empresaId: number;
  tipo: 'SOCIO' | 'EMPRESA' | 'BANCO' | 'CAIXA';
  nome: string;
  saldoInicial: number;
  ativa: boolean;
}

export interface UpdateContaDTO extends Partial<CreateContaDTO> {}
