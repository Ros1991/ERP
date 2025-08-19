import type { Funcionario } from "../funcionario";

export interface Emprestimo {
  emprestimoId: number;
  empresaId: number;
  funcionarioId: number;
  funcionario: Funcionario;
  valorTotal: number;
  valorPago: number;
  valorPendente: number;
  totalParcelas: number;
  parcelasPagas: number;
  quandoCobrar: 'MENSAL' | 'FERIAS' | '13_SALARIO' | 'TUDO';
  dataEmprestimo: string;
  dataInicioCobranca: string;
  status: 'ATIVO' | 'QUITADO' | 'CANCELADO';
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmprestimoDTO {
  empresaId: number;
  funcionarioId: number;
  valorTotal: number;
  totalParcelas: number;
  quandoCobrar: 'MENSAL' | 'FERIAS' | '13_SALARIO' | 'TUDO';
  dataEmprestimo: string;
  dataInicioCobranca: string;
  observacoes?: string;
}

export interface UpdateEmprestimoDTO {
  valorPago?: number;
  parcelasPagas?: number;
  status?: 'ATIVO' | 'QUITADO' | 'CANCELADO';
  observacoes?: string;
}
