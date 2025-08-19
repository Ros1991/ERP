import api from '../../lib/axios';
import type { Emprestimo, CreateEmprestimoDTO } from '../../models/financeiro/Emprestimo.model';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

class EmprestimoService {
  async getAll(empresaId: number, page = 1, limit = 10, search?: string): Promise<PaginatedResponse<Emprestimo>> {
    const params: any = { page, limit };
    if (search) params.search = search;
    
    const response = await api.get(`/empresas/${empresaId}/emprestimos`, { params });
    return {
      data: response.data.data.items,
      total: response.data.data.pagination.total,
      page: response.data.data.pagination.page,
      limit: response.data.data.pagination.limit,
    };
  }

  async getById(empresaId: number, emprestimoId: number): Promise<Emprestimo> {
    const response = await api.get(`/empresas/${empresaId}/emprestimos/${emprestimoId}`);
    return response.data.data;
  }

  async create(empresaId: number, emprestimo: CreateEmprestimoDTO): Promise<Emprestimo> {
    const response = await api.post(`/empresas/${empresaId}/emprestimos`, emprestimo);
    return response.data.data;
  }

  async update(empresaId: number, emprestimoId: number, emprestimo: Partial<Emprestimo>): Promise<Emprestimo> {
    const response = await api.put(`/empresas/${empresaId}/emprestimos/${emprestimoId}`, emprestimo);
    return response.data.data;
  }

  async delete(empresaId: number, emprestimoId: number): Promise<void> {
    await api.delete(`/empresas/${empresaId}/emprestimos/${emprestimoId}`);
  }
}

export const emprestimoService = new EmprestimoService();
