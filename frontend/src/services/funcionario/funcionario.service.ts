import api from '../../lib/axios';
import { API_CONFIG } from '../../config/api.config';
import type { Funcionario, CreateFuncionarioDTO, UpdateFuncionarioDTO } from '../../models/funcionario/Funcionario.model';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

class FuncionarioService {
  private getEndpoint(empresaId: number | string) {
    return `${API_CONFIG.endpoints.empresas}/${empresaId}/funcionarios`;
  }

  async getAll(empresaId: number | string, page = 1, limit = 10, search?: string): Promise<PaginatedResponse<Funcionario>> {
    const params: any = { page, limit };
    if (search && search.trim()) {
      params.search = search.trim();
    }
    
    const response = await api.get(
      this.getEndpoint(empresaId),
      { params }
    );
    
    // Map backend response structure to frontend expected structure
    const backendData = response.data.data; // Nested data from backend
    return {
      data: backendData.items,
      total: backendData.pagination.total,
      page: backendData.pagination.page,
      limit: backendData.pagination.limit
    };
  }

  async getById(empresaId: number | string, id: string): Promise<Funcionario> {
    const response = await api.get(
      `${this.getEndpoint(empresaId)}/${id}`
    );
    return response.data.data; // Extract data from backend response
  }

  async create(empresaId: number | string, data: CreateFuncionarioDTO): Promise<Funcionario> {
    const response = await api.post(
      this.getEndpoint(empresaId),
      data
    );
    return response.data.data; // Extract data from backend response
  }

  async update(empresaId: number | string, id: string, data: UpdateFuncionarioDTO): Promise<Funcionario> {
    const response = await api.put(
      `${this.getEndpoint(empresaId)}/${id}`,
      data
    );
    return response.data.data; // Extract data from backend response
  }

  async delete(empresaId: number | string, id: string): Promise<void> {
    await api.delete(`${this.getEndpoint(empresaId)}/${id}`);
  }
}

export const funcionarioService = new FuncionarioService();
