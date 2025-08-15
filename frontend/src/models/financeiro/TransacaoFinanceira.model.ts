export interface TransacaoFinanceira {
  id: number;
  empresaId: number;
  contaId: number;
  tipo: 'RECEITA' | 'DESPESA';
  categoria: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  descricao: string;
  observacoes?: string;
  terceiroId?: number;
  numeroDocumento?: string;
  formaPagamento?: 'DINHEIRO' | 'PIX' | 'BOLETO' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'TRANSFERENCIA';
  status: 'PENDENTE' | 'PAGO' | 'CANCELADO';
  isRecorrente: boolean;
  recorrenciaTipo?: 'MENSAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransacaoFinanceiraDTO {
  empresaId: number;
  contaId: number;
  tipo: 'RECEITA' | 'DESPESA';
  categoria: string;
  valor: number;
  dataVencimento: string;
  descricao: string;
  observacoes?: string;
  terceiroId?: number;
  numeroDocumento?: string;
  formaPagamento?: 'DINHEIRO' | 'PIX' | 'BOLETO' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'TRANSFERENCIA';
  isRecorrente?: boolean;
  recorrenciaTipo?: 'MENSAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';
}

export interface UpdateTransacaoFinanceiraDTO extends Partial<CreateTransacaoFinanceiraDTO> {
  dataPagamento?: string;
  status?: 'PENDENTE' | 'PAGO' | 'CANCELADO';
}
