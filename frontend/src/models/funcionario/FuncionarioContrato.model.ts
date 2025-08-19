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
  isDeleted: boolean;
  deletedAt?: string;
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
  ativo?: boolean;
  observacoes?: string;
}

export interface UpdateFuncionarioContratoDTO extends Partial<CreateFuncionarioContratoDTO> {}
