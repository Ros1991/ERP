export interface FuncionarioBeneficioDesconto {
  beneficioDescontoId: number;
  contratoId: number;
  tipo: 'BENEFICIO' | 'DESCONTO';
  nome: string;
  valor: number;
  frequencia: 'MENSAL' | 'ANUAL' | 'UMA_VEZ' | 'FERIAS' | '13_SALARIO';
  dataInicio: string;
  dataFim?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFuncionarioBeneficioDescontoDTO {
  contratoId: number;
  tipo: 'BENEFICIO' | 'DESCONTO';
  nome: string;
  valor: number;
  frequencia: 'MENSAL' | 'ANUAL' | 'UMA_VEZ' | 'FERIAS' | '13_SALARIO';
  dataInicio: string;
  dataFim?: string;
  ativo?: boolean;
}

export interface UpdateFuncionarioBeneficioDescontoDTO extends Partial<CreateFuncionarioBeneficioDescontoDTO> {}
