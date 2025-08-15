export interface Funcionario {
  id: number;
  empresaId: number;
  nome: string;
  cpf: string;
  rg?: string;
  dataNascimento?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  cargo?: string;
  departamento?: string;
  dataAdmissao?: string;
  dataDemissao?: string;
  salarioBase?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFuncionarioDTO {
  empresaId: number;
  nome: string;
  cpf: string;
  rg?: string;
  dataNascimento?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  cargo?: string;
  departamento?: string;
  dataAdmissao?: string;
  salarioBase?: number;
}

export interface UpdateFuncionarioDTO extends Partial<CreateFuncionarioDTO> {
  dataDemissao?: string;
  isActive?: boolean;
}
