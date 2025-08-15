import api from '../../lib/axios';
import type { 
  FuncionarioContrato, 
  CreateFuncionarioContratoDTO, 
  UpdateFuncionarioContratoDTO 
} from '../../models/funcionario/FuncionarioContrato.model';

export const funcionarioContratoService = {
  async getAllByFuncionario(empresaId: string, funcionarioId: string): Promise<FuncionarioContrato[]> {
    const response = await api.get(`/empresas/${empresaId}/funcionarios/${funcionarioId}/contratos`);
    return response.data;
  },

  async getById(empresaId: string, funcionarioId: string, contratoId: string): Promise<FuncionarioContrato> {
    const response = await api.get(`/empresas/${empresaId}/funcionarios/${funcionarioId}/contratos/${contratoId}`);
    return response.data;
  },

  async create(empresaId: string, funcionarioId: string, data: CreateFuncionarioContratoDTO): Promise<FuncionarioContrato> {
    const response = await api.post(`/empresas/${empresaId}/funcionarios/${funcionarioId}/contratos`, data);
    return response.data;
  },

  async update(empresaId: string, funcionarioId: string, contratoId: string, data: Partial<CreateFuncionarioContratoDTO>): Promise<FuncionarioContrato> {
    const response = await api.put(`/empresas/${empresaId}/funcionarios/${funcionarioId}/contratos/${contratoId}`, data);
    return response.data;
  },

  async delete(empresaId: string, funcionarioId: string, contratoId: string): Promise<void> {
    await api.delete(`/empresas/${empresaId}/funcionarios/${funcionarioId}/contratos/${contratoId}`);
  },

  async toggleActive(empresaId: string, funcionarioId: string, contratoId: string): Promise<FuncionarioContrato> {
    const response = await api.patch(`/empresas/${empresaId}/funcionarios/${funcionarioId}/contratos/${contratoId}/toggle-active`);
    return response.data;
  }
};
