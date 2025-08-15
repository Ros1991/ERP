export interface Emprestimo {
  id: number;
  empresaId: number;
  funcionarioId: number;
  valor: number;
  taxaJuros?: number;
  numeroParcelas: number;
  valorParcela: number;
  dataEmprestimo: string;
  dataPrimeiraParcela: string;
  dataUltimaParcela?: string;
  motivoEmprestimo?: string;
  status: 'ATIVO' | 'QUITADO' | 'CANCELADO';
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmprestimoDTO {
  empresaId: number;
  funcionarioId: number;
  valor: number;
  taxaJuros?: number;
  numeroParcelas: number;
  dataEmprestimo: string;
  dataPrimeiraParcela: string;
  motivoEmprestimo?: string;
  observacoes?: string;
}

export interface UpdateEmprestimoDTO {
  status?: 'ATIVO' | 'QUITADO' | 'CANCELADO';
  dataUltimaParcela?: string;
  observacoes?: string;
}
