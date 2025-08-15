export interface TarefaFuncionarioStatus {
  id: number;
  tarefaId: number;
  funcionarioId: number;
  empresaId: number;
  status: 'ATRIBUIDA' | 'EM_ANDAMENTO' | 'PAUSADA' | 'CONCLUIDA' | 'CANCELADA';
  dataInicio?: string;
  dataFim?: string;
  observacoes?: string;
  horasTrabalhadas?: number;
  percentualConcluido?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTarefaFuncionarioStatusDTO {
  tarefaId: number;
  funcionarioId: number;
  empresaId: number;
  status: 'ATRIBUIDA' | 'EM_ANDAMENTO' | 'PAUSADA' | 'CONCLUIDA' | 'CANCELADA';
  dataInicio?: string;
  observacoes?: string;
}

export interface UpdateTarefaFuncionarioStatusDTO {
  status?: 'ATRIBUIDA' | 'EM_ANDAMENTO' | 'PAUSADA' | 'CONCLUIDA' | 'CANCELADA';
  dataFim?: string;
  observacoes?: string;
  horasTrabalhadas?: number;
  percentualConcluido?: number;
}
