export interface TarefaFuncionarioStatus {
  statusId: number;
  empresaId: number;
  tarefaId: number;
  funcionarioId: number;
  status: 'ATRIBUIDA' | 'EM_ANDAMENTO' | 'PAUSADA' | 'CONCLUIDA' | 'CANCELADA';
  observacao?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTarefaFuncionarioStatusDTO {
  empresaId: number;
  tarefaId: number;
  funcionarioId: number;
  status?: 'ATRIBUIDA' | 'EM_ANDAMENTO' | 'PAUSADA' | 'CONCLUIDA' | 'CANCELADA';
  observacao?: string;
}

export interface UpdateTarefaFuncionarioStatusDTO {
  status?: 'ATRIBUIDA' | 'EM_ANDAMENTO' | 'PAUSADA' | 'CONCLUIDA' | 'CANCELADA';
  observacao?: string;
}
