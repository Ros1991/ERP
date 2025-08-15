export interface CentroCusto {
  centroCustoId: number;
  empresaId: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCentroCustoDTO {
  empresaId: number;
  nome: string;
  descricao?: string;
  ativo?: boolean;
}

export interface UpdateCentroCustoDTO extends Partial<CreateCentroCustoDTO> {}
