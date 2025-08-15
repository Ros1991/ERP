import api from '../../lib/axios';
import { API_CONFIG } from '../../config/api.config';
import type { Funcionario, CreateFuncionarioDTO, UpdateFuncionarioDTO } from '../../models/funcionario/Funcionario.model';
import type { PaginatedResponse, QueryParams } from '../../types/common.types';

class FuncionarioService {
  private getEndpoint(empresaId: number | string) {
    return `${API_CONFIG.endpoints.empresas}/${empresaId}/funcionarios`;
  }

  async getAll(empresaId: number | string, params?: QueryParams): Promise<PaginatedResponse<Funcionario>> {
    const response = await api.get<PaginatedResponse<Funcionario>>(
      this.getEndpoint(empresaId),
      { params }
    );
    return response.data;
  }

  async getById(empresaId: number | string, id: string): Promise<Funcionario> {
    const response = await api.get<Funcionario>(
      `${this.getEndpoint(empresaId)}/${id}`
    );
    return response.data;
  }

  async create(empresaId: number | string, data: CreateFuncionarioDTO): Promise<Funcionario> {
    const response = await api.post<Funcionario>(
      this.getEndpoint(empresaId),
      { ...data, empresaId: Number(empresaId) }
    );
    return response.data;
  }

  async update(empresaId: number | string, id: string, data: UpdateFuncionarioDTO): Promise<Funcionario> {
    const response = await api.put<Funcionario>(
      `${this.getEndpoint(empresaId)}/${id}`,
      data
    );
    return response.data;
  }

  async delete(empresaId: number | string, id: string): Promise<void> {
    await api.delete(`${this.getEndpoint(empresaId)}/${id}`);
  }
}

export const funcionarioService = new FuncionarioService();
