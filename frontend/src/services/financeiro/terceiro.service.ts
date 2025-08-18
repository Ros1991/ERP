import api from '../../lib/axios';
import type { Terceiro, CreateTerceiroDTO, UpdateTerceiroDTO } from '../../models/financeiro/Terceiro.model';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

class TerceiroService {
  async getAll(empresaId: number, page = 1, limit = 10, search?: string): Promise<PaginatedResponse<Terceiro>> {
    const params: any = { page, limit };
    if (search && search.trim()) {
      params.search = search.trim();
    }
    
    const response = await api.get(
      `/empresas/${empresaId}/terceiros`,
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

  async getById(empresaId: number, terceiroId: number): Promise<Terceiro> {
    const response = await api.get(`/empresas/${empresaId}/terceiros/${terceiroId}`);
    return response.data.data; // Extract data from backend response
  }

  async create(empresaId: number, dto: CreateTerceiroDTO): Promise<Terceiro> {
    const response = await api.post(`/empresas/${empresaId}/terceiros`, dto);
    return response.data.data; // Extract data from backend response
  }

  async update(empresaId: number, terceiroId: number, dto: UpdateTerceiroDTO): Promise<Terceiro> {
    const response = await api.put(`/empresas/${empresaId}/terceiros/${terceiroId}`, dto);
    return response.data.data; // Extract data from backend response
  }

  async delete(empresaId: number, terceiroId: number): Promise<void> {
    await api.delete(`/empresas/${empresaId}/terceiros/${terceiroId}`);
  }
}

export default new TerceiroService();
