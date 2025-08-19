export interface TransacaoFinanceira {
  transacaoId: number;
  empresaId: number;
  contaId: number;
  terceiroId?: number;
  tipo: 'RECEITA' | 'DESPESA';
  descricao: string;
  valor: number;
  dataTransacao: string;
  dataVencimento?: string;
  status: 'PENDENTE' | 'PAGO' | 'CANCELADO';
  observacoes?: string;
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
  dataTransacao: string;
  dataVencimento?: string;
  status?: 'PENDENTE' | 'PAGO' | 'CANCELADO';
  observacoes?: string;
}

export interface UpdateTransacaoFinanceiraDTO extends Partial<CreateTransacaoFinanceiraDTO> {}
