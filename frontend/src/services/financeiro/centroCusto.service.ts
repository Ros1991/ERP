import api from '../../lib/axios';
import type { CentroCusto, CreateCentroCustoDTO, UpdateCentroCustoDTO } from '../../models/financeiro/CentroCusto.model';

interface PaginatedResponse {
  data: CentroCusto[];
  total: number;
  page: number;
  limit: number;
}

class CentroCustoService {
  async getAll(empresaId: number, page: number = 1, limit: number = 10): Promise<PaginatedResponse> {
    const response = await api.get(
      `/empresas/${empresaId}/centro-custos`,
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

  async getById(empresaId: number, centroCustoId: number): Promise<CentroCusto> {
    const response = await api.get(`/empresas/${empresaId}/centro-custos/${centroCustoId}`);
    return response.data.data; // Extract data from backend response
  }

  async create(empresaId: number, data: CreateCentroCustoDTO): Promise<CentroCusto> {
    const response = await api.post(`/empresas/${empresaId}/centro-custos`, data);
    return response.data.data; // Extract data from backend response
  }

  async update(empresaId: number, centroCustoId: number, data: UpdateCentroCustoDTO): Promise<CentroCusto> {
    const response = await api.put(`/empresas/${empresaId}/centro-custos/${centroCustoId}`, data);
    return response.data.data; // Extract data from backend response
  }

  async delete(empresaId: number, centroCustoId: number): Promise<void> {
    await api.delete(`/empresas/${empresaId}/centro-custos/${centroCustoId}`);
  }
}

export default new CentroCustoService();
