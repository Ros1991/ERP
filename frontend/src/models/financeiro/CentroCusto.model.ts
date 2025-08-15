export interface CentroCusto {
  id: number;
  empresaId: number;
  codigo: string;
  nome: string;
  descricao?: string;
  tipo: 'OPERACIONAL' | 'ADMINISTRATIVO' | 'COMERCIAL' | 'INVESTIMENTO';
  centroCustoPaiId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCentroCustoDTO {
  empresaId: number;
  codigo: string;
  nome: string;
  descricao?: string;
  tipo: 'OPERACIONAL' | 'ADMINISTRATIVO' | 'COMERCIAL' | 'INVESTIMENTO';
  centroCustoPaiId?: number;
}

export interface UpdateCentroCustoDTO extends Partial<CreateCentroCustoDTO> {
  isActive?: boolean;
}
