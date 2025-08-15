export interface TarefaTipo {
  id: number;
  empresaId: number;
  nome: string;
  descricao?: string;
  cor?: string;
  icone?: string;
  ordem?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTarefaTipoDTO {
  empresaId: number;
  nome: string;
  descricao?: string;
  cor?: string;
  icone?: string;
  ordem?: number;
}

export interface UpdateTarefaTipoDTO extends Partial<CreateTarefaTipoDTO> {
  isActive?: boolean;
}
