import api from '../../lib/axios';
import type { 
  FuncionarioBeneficioDesconto, 
  CreateFuncionarioBeneficioDescontoDTO 
} from '../../models/funcionario/Funcionario.model';

export const funcionarioBeneficioDescontoService = {
  async getAllByContrato(empresaId: string, funcionarioId: string, contratoId: string): Promise<FuncionarioBeneficioDesconto[]> {
    const response = await api.get(`/empresas/${empresaId}/funcionarios/${funcionarioId}/contratos/${contratoId}/beneficios-descontos`);
    return response.data;
  },

  async getById(empresaId: string, funcionarioId: string, contratoId: string, beneficioDescontoId: string): Promise<FuncionarioBeneficioDesconto> {
    const response = await api.get(`/empresas/${empresaId}/funcionarios/${funcionarioId}/contratos/${contratoId}/beneficios-descontos/${beneficioDescontoId}`);
    return response.data;
  },

  async create(empresaId: string, funcionarioId: string, contratoId: string, data: CreateFuncionarioBeneficioDescontoDTO): Promise<FuncionarioBeneficioDesconto> {
    const response = await api.post(`/empresas/${empresaId}/funcionarios/${funcionarioId}/contratos/${contratoId}/beneficios-descontos`, data);
    return response.data;
  },

  async update(empresaId: string, funcionarioId: string, contratoId: string, beneficioDescontoId: string, data: Partial<CreateFuncionarioBeneficioDescontoDTO>): Promise<FuncionarioBeneficioDesconto> {
    const response = await api.put(`/empresas/${empresaId}/funcionarios/${funcionarioId}/contratos/${contratoId}/beneficios-descontos/${beneficioDescontoId}`, data);
    return response.data;
  },

  async delete(empresaId: string, funcionarioId: string, contratoId: string, beneficioDescontoId: string): Promise<void> {
    await api.delete(`/empresas/${empresaId}/funcionarios/${funcionarioId}/contratos/${contratoId}/beneficios-descontos/${beneficioDescontoId}`);
  }
};
