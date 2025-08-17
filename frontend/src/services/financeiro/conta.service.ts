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
    const response = await api.get<PaginatedResponse<Conta>>(
      `/empresas/${empresaId}/contas`,
      { params: { page, limit } }
    );
    return response.data;
  }

  async getById(empresaId: number, contaId: number): Promise<Conta> {
    const response = await api.get<Conta>(`/empresas/${empresaId}/contas/${contaId}`);
    return response.data;
  }

  async create(empresaId: number, dto: CreateContaDTO): Promise<Conta> {
    const response = await api.post<Conta>(`/empresas/${empresaId}/contas`, dto);
    return response.data;
  }

  async update(empresaId: number, contaId: number, dto: UpdateContaDTO): Promise<Conta> {
    const response = await api.put<Conta>(`/empresas/${empresaId}/contas/${contaId}`, dto);
    return response.data;
  }

  async delete(empresaId: number, contaId: number): Promise<void> {
    await api.delete(`/empresas/${empresaId}/contas/${contaId}`);
  }
}

export default new ContaService();
