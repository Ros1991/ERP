export interface FuncionarioBeneficioDesconto {
  id: number;
  funcionarioId: number;
  empresaId: number;
  tipo: 'BENEFICIO' | 'DESCONTO';
  nome: string;
  descricao?: string;
  valor: number;
  tipoValor: 'FIXO' | 'PERCENTUAL';
  recorrencia: 'MENSAL' | 'ANUAL' | 'UNICO';
  dataInicio: string;
  dataFim?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFuncionarioBeneficioDescontoDTO {
  funcionarioId: number;
  empresaId: number;
  tipo: 'BENEFICIO' | 'DESCONTO';
  nome: string;
  descricao?: string;
  valor: number;
  tipoValor: 'FIXO' | 'PERCENTUAL';
  recorrencia: 'MENSAL' | 'ANUAL' | 'UNICO';
  dataInicio: string;
  dataFim?: string;
}

export interface UpdateFuncionarioBeneficioDescontoDTO extends Partial<CreateFuncionarioBeneficioDescontoDTO> {
  isActive?: boolean;
}
