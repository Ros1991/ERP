import api from '../../lib/axios';
import type { Conta, CreateContaDTO, UpdateContaDTO } from '../../models/financeiro/Conta.model';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

class ContaService {
  async getAll(empresaId: number, page = 1, limit = 10): Promise<PaginatedResponse<Conta>> {
    const response = await api.get(
      `/empresas/${empresaId}/contas`,
      { params: { page, limit } }
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

  async getById(empresaId: number, contaId: number): Promise<Conta> {
    const response = await api.get(`/empresas/${empresaId}/contas/${contaId}`);
    return response.data.data; // Extract data from backend response
  }

  async create(empresaId: number, dto: CreateContaDTO): Promise<Conta> {
    const response = await api.post(`/empresas/${empresaId}/contas`, dto);
    return response.data.data; // Extract data from backend response
  }

  async update(empresaId: number, contaId: number, dto: UpdateContaDTO): Promise<Conta> {
    const response = await api.put(`/empresas/${empresaId}/contas/${contaId}`, dto);
    return response.data.data; // Extract data from backend response
  }

  async delete(empresaId: number, contaId: number): Promise<void> {
    await api.delete(`/empresas/${empresaId}/contas/${contaId}`);
  }
}

export default new ContaService();
