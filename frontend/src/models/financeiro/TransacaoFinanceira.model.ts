export interface TransacaoFinanceira {
  transacaoFinanceiraId: number;
  empresaId: number;
  contaId: number;
  terceiroId?: number;
  tipo: 'RECEITA' | 'DESPESA';
  descricao: string;
  valor: number;
  data: string;
  observacao?: string;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransacaoFinanceiraDTO {
  empresaId: number;
  contaId: number;
  terceiroId?: number;
  tipo: 'RECEITA' | 'DESPESA';
  descricao: string;
  valor: number;
  data: string;
  observacao?: string;
}

export interface UpdateTransacaoFinanceiraDTO extends Partial<CreateTransacaoFinanceiraDTO> {}
