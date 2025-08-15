export interface Tarefa {
  id: number;
  empresaId: number;
  tarefaTipoId: number;
  titulo: string;
  descricao?: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
  dataInicio?: string;
  dataFim?: string;
  dataPrazo?: string;
  responsavelId?: number;
  observacoes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTarefaDTO {
  empresaId: number;
  tarefaTipoId: number;
  titulo: string;
  descricao?: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  dataInicio?: string;
  dataPrazo?: string;
  responsavelId?: number;
  observacoes?: string;
}

export interface UpdateTarefaDTO extends Partial<CreateTarefaDTO> {
  status?: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
  dataFim?: string;
  isActive?: boolean;
}
