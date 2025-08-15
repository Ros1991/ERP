import api from '../../lib/axios';
import type { Terceiro, CreateTerceiroDTO, UpdateTerceiroDTO } from '../../models/financeiro/Terceiro.model';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

class TerceiroService {
  async getAll(empresaId: number, page = 1, limit = 10): Promise<PaginatedResponse<Terceiro>> {
    const response = await api.get<PaginatedResponse<Terceiro>>(
      `/empresas/${empresaId}/terceiros`,
      { params: { page, limit } }
    );
    return response.data;
  }

  async getById(empresaId: number, terceiroId: number): Promise<Terceiro> {
    const response = await api.get<Terceiro>(`/empresas/${empresaId}/terceiros/${terceiroId}`);
    return response.data;
  }

  async create(empresaId: number, dto: CreateTerceiroDTO): Promise<Terceiro> {
    const response = await api.post<Terceiro>(`/empresas/${empresaId}/terceiros`, dto);
    return response.data;
  }

  async update(empresaId: number, terceiroId: number, dto: UpdateTerceiroDTO): Promise<Terceiro> {
    const response = await api.put<Terceiro>(`/empresas/${empresaId}/terceiros/${terceiroId}`, dto);
    return response.data;
  }

  async delete(empresaId: number, terceiroId: number): Promise<void> {
    await api.delete(`/empresas/${empresaId}/terceiros/${terceiroId}`);
  }
}

export default new TerceiroService();
