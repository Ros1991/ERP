import api from '../../lib/axios';
import type { 
  FuncionarioBeneficioDesconto, 
  CreateFuncionarioBeneficioDescontoDTO 
} from '../../models/funcionario/Funcionario.model';

export const funcionarioBeneficioDescontoService = {
  async getAllByContrato(empresaId: string, contratoId: string): Promise<FuncionarioBeneficioDesconto[]> {
    const response = await api.get(`/empresas/${empresaId}/funcionario-beneficio-descontos`, {
      params: { contratoId }
    });
    return response.data.data; // Extract data from backend response
  },

  async getById(empresaId: string, beneficioDescontoId: string): Promise<FuncionarioBeneficioDesconto> {
    const response = await api.get(`/empresas/${empresaId}/funcionario-beneficio-descontos/${beneficioDescontoId}`);
    return response.data.data; // Extract data from backend response
  },

  async create(empresaId: string, data: CreateFuncionarioBeneficioDescontoDTO): Promise<FuncionarioBeneficioDesconto> {
    const response = await api.post(`/empresas/${empresaId}/funcionario-beneficio-descontos`, data);
    return response.data.data; // Extract data from backend response
  },

  async update(empresaId: string, beneficioDescontoId: string, data: Partial<CreateFuncionarioBeneficioDescontoDTO>): Promise<FuncionarioBeneficioDesconto> {
    const response = await api.put(`/empresas/${empresaId}/funcionario-beneficio-descontos/${beneficioDescontoId}`, data);
    return response.data.data; // Extract data from backend response
  },

  async delete(empresaId: string, beneficioDescontoId: string): Promise<void> {
    await api.delete(`/empresas/${empresaId}/funcionario-beneficio-descontos/${beneficioDescontoId}`);
  }
};
