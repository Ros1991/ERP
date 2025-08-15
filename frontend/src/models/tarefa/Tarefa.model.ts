export interface Tarefa {
  tarefaId: number;
  empresaId: number;
  tipoId?: number;
  titulo: string;
  descricao?: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'PAUSADA' | 'PARADA' | 'CONCLUIDA' | 'CANCELADA';
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  dataInicio?: string;
  dataPrazo?: string;
  dataConclusao?: string;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTarefaDTO {
  empresaId: number;
  tipoId?: number;
  titulo: string;
  descricao?: string;
  status?: 'PENDENTE' | 'EM_ANDAMENTO' | 'PAUSADA' | 'PARADA' | 'CONCLUIDA' | 'CANCELADA';
  prioridade?: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  dataInicio?: string;
  dataPrazo?: string;
  dataConclusao?: string;
}

export interface UpdateTarefaDTO extends Partial<CreateTarefaDTO> {}
