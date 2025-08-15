export interface FuncionarioContrato {
  id: number;
  funcionarioId: number;
  empresaId: number;
  tipoContrato: 'CLT' | 'PJ' | 'ESTAGIO' | 'TEMPORARIO' | 'TERCEIRIZADO';
  dataInicio: string;
  dataFim?: string;
  salarioBase: number;
  cargaHoraria: number;
  observacoes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFuncionarioContratoDTO {
  funcionarioId: number;
  empresaId: number;
  tipoContrato: 'CLT' | 'PJ' | 'ESTAGIO' | 'TEMPORARIO' | 'TERCEIRIZADO';
  dataInicio: string;
  dataFim?: string;
  salarioBase: number;
  cargaHoraria: number;
  observacoes?: string;
}

export interface UpdateFuncionarioContratoDTO extends Partial<CreateFuncionarioContratoDTO> {
  isActive?: boolean;
}
