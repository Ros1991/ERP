import api from '../../lib/axios';
import type { 
  FuncionarioContrato, 
  CreateFuncionarioContratoDTO
} from '../../models/funcionario/FuncionarioContrato.model';

export const funcionarioContratoService = {
  async getAllByFuncionario(empresaId: string, funcionarioId: string): Promise<FuncionarioContrato[]> {
    const response = await api.get(`/empresas/${empresaId}/funcionario-contratos`, {
      params: { funcionarioId }
    });
    return response.data.data; // Extract data from backend response
  },

  async getById(empresaId: string, contratoId: string): Promise<FuncionarioContrato> {
    const response = await api.get(`/empresas/${empresaId}/funcionario-contratos/${contratoId}`);
    return response.data.data; // Extract data from backend response
  },

  async create(empresaId: string, data: CreateFuncionarioContratoDTO): Promise<FuncionarioContrato> {
    const response = await api.post(`/empresas/${empresaId}/funcionario-contratos`, data);
    return response.data.data; // Extract data from backend response
  },

  async update(empresaId: string, contratoId: string, data: Partial<CreateFuncionarioContratoDTO>): Promise<FuncionarioContrato> {
    const response = await api.put(`/empresas/${empresaId}/funcionario-contratos/${contratoId}`, data);
    return response.data.data; // Extract data from backend response
  },

  async delete(empresaId: string, contratoId: string): Promise<void> {
    await api.delete(`/empresas/${empresaId}/funcionario-contratos/${contratoId}`);
  },

  async toggleActive(empresaId: string, contratoId: string): Promise<FuncionarioContrato> {
    const response = await api.patch(`/empresas/${empresaId}/funcionario-contratos/${contratoId}/toggle-active`);
    return response.data.data; // Extract data from backend response
  }
};
