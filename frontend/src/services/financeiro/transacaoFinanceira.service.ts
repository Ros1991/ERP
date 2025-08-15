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
    const response = await api.get<PaginatedResponse>(`/transacao-financeiras`, {
      params: { empresaId, page, limit }
    });
    return response.data;
  }

  async getById(empresaId: number, transacaoFinanceiraId: number): Promise<TransacaoFinanceira> {
    const response = await api.get<TransacaoFinanceira>(`/transacao-financeiras/${transacaoFinanceiraId}`, {
      params: { empresaId }
    });
    return response.data;
  }

  async create(empresaId: number, data: CreateTransacaoFinanceiraDTO): Promise<TransacaoFinanceira> {
    const response = await api.post<TransacaoFinanceira>('/transacao-financeiras', {
      ...data,
      empresaId
    });
    return response.data;
  }

  async update(empresaId: number, transacaoFinanceiraId: number, data: UpdateTransacaoFinanceiraDTO): Promise<TransacaoFinanceira> {
    const response = await api.put<TransacaoFinanceira>(`/transacao-financeiras/${transacaoFinanceiraId}`, {
      ...data,
      empresaId
    });
    return response.data;
  }

  async delete(empresaId: number, transacaoFinanceiraId: number): Promise<void> {
    await api.delete(`/transacao-financeiras/${transacaoFinanceiraId}`, {
      params: { empresaId }
    });
  }
}

export default new TransacaoFinanceiraService();
