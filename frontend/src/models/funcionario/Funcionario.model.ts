export interface Funcionario {
  funcionarioId: number;
  empresaId: number;
  usuarioEmpresaId?: number;
  nome?: string;
  apelido: string;
  cpf?: string;
  rg?: string;
  dataNascimento?: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  isDeleted: boolean;
}

export interface CreateFuncionarioDTO {
  empresaId: number;
  usuarioEmpresaId?: number;
  nome?: string;
  apelido: string;
  cpf?: string;
  rg?: string;
  dataNascimento?: string;
  endereco?: string;
  telefone?: string;
  email?: string;
}

export interface UpdateFuncionarioDTO extends Partial<CreateFuncionarioDTO> {
  ativo?: boolean;
}

export interface FuncionarioContrato {
  contratoId: number;
  funcionarioId: number;
  tipoContrato: 'CLT' | 'PJ' | 'ESTAGIARIO' | 'TERCEIRIZADO';
  tipoPagamento: 'HORISTA' | 'DIARISTA' | 'MENSALISTA';
  formaPagamento?: string;
  salario: number;
  cargaHorariaSemanal?: number;
  dataInicio: string;
  dataFim?: string;
  ativo: boolean;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFuncionarioContratoDTO {
  funcionarioId: number;
  tipoContrato: 'CLT' | 'PJ' | 'ESTAGIARIO' | 'TERCEIRIZADO';
  tipoPagamento: 'HORISTA' | 'DIARISTA' | 'MENSALISTA';
  formaPagamento?: string;
  salario: number;
  cargaHorariaSemanal?: number;
  dataInicio: string;
  dataFim?: string;
  observacoes?: string;
}

export interface FuncionarioBeneficioDesconto {
  beneficioDescontoId: number;
  contratoId: number;
  tipo: 'BENEFICIO' | 'DESCONTO';
  nome: string;
  valor: number;
  frequencia: 'MENSAL' | 'ANUAL' | 'UMA_VEZ' | 'FERIAS' | '13_SALARIO';
  dataInicio: string;
  dataFim?: string;
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
