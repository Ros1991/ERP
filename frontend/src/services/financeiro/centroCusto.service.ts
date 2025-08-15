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
    const response = await api.get<PaginatedResponse>(`/centro-custos`, {
      params: { empresaId, page, limit }
    });
    return response.data;
  }

  async getById(empresaId: number, centroCustoId: number): Promise<CentroCusto> {
    const response = await api.get<CentroCusto>(`/centro-custos/${centroCustoId}`, {
      params: { empresaId }
    });
    return response.data;
  }

  async create(empresaId: number, data: CreateCentroCustoDTO): Promise<CentroCusto> {
    const response = await api.post<CentroCusto>('/centro-custos', {
      ...data,
      empresaId
    });
    return response.data;
  }

  async update(empresaId: number, centroCustoId: number, data: UpdateCentroCustoDTO): Promise<CentroCusto> {
    const response = await api.put<CentroCusto>(`/centro-custos/${centroCustoId}`, {
      ...data,
      empresaId
    });
    return response.data;
  }

  async delete(empresaId: number, centroCustoId: number): Promise<void> {
    await api.delete(`/centro-custos/${centroCustoId}`, {
      params: { empresaId }
    });
  }
}

export default new CentroCustoService();
