import api from '../../lib/axios';
import type { TransacaoFinanceira, CreateTransacaoFinanceiraDTO, UpdateTransacaoFinanceiraDTO } from '../../models/financeiro/TransacaoFinanceira.model';

interface PaginatedResponse {
  data: TransacaoFinanceira[];
  total: number;
  page: number;
  limit: number;
}

class TransacaoFinanceiraService {
  async getAll(empresaId: number, page: number = 1, limit: number = 10): Promise<PaginatedResponse> {
    const response = await api.get(
      `/empresas/${empresaId}/transacao-financeiras`,
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

  async getById(empresaId: number, transacaoFinanceiraId: number): Promise<TransacaoFinanceira> {
    const response = await api.get(`/empresas/${empresaId}/transacao-financeiras/${transacaoFinanceiraId}`);
    return response.data.data; // Extract data from backend response
  }

  async create(empresaId: number, data: CreateTransacaoFinanceiraDTO): Promise<TransacaoFinanceira> {
    const response = await api.post(`/empresas/${empresaId}/transacao-financeiras`, data);
    return response.data.data; // Extract data from backend response
  }

  async update(empresaId: number, transacaoFinanceiraId: number, data: UpdateTransacaoFinanceiraDTO): Promise<TransacaoFinanceira> {
    const response = await api.put(`/empresas/${empresaId}/transacao-financeiras/${transacaoFinanceiraId}`, data);
    return response.data.data; // Extract data from backend response
  }

  async delete(empresaId: number, transacaoFinanceiraId: number): Promise<void> {
    await api.delete(`/empresas/${empresaId}/transacao-financeiras/${transacaoFinanceiraId}`);
  }
}

export default new TransacaoFinanceiraService();
