export interface TarefaTipo {
  tipoId: number;
  empresaId: number;
  nome: string;
  gerenteFuncionarioId?: number;
  centroCustoId?: number;
  cor?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTarefaTipoDTO {
  empresaId: number;
  nome: string;
  gerenteFuncionarioId?: number;
  centroCustoId?: number;
  cor?: string;
  ativo?: boolean;
}

export interface UpdateTarefaTipoDTO extends Partial<CreateTarefaTipoDTO> {}
