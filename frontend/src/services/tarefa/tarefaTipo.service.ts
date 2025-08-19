import api from '../../lib/axios'; // config/api';
import type { TarefaTipo, CreateTarefaTipoDTO, UpdateTarefaTipoDTO } from '../../models/tarefa/TarefaTipo.model';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

class TarefaTipoService {
  async getAll(empresaId: number, page = 1, limit = 10, search?: string): Promise<PaginatedResponse<TarefaTipo>> {
    const params: any = { page, limit };
    if (search) {
      params.search = search;
    }
    
    const response = await api.get(`/empresas/${empresaId}/tarefa-tipos`, { params });
    return {
      data: response.data.data.items || response.data.data,
      total: response.data.data.pagination?.total || response.data.data.length,
      page: response.data.data.pagination?.page || page,
      limit: response.data.data.pagination?.limit || limit,
    };
  }

  async getAllSimple(empresaId: number): Promise<TarefaTipo[]> {
    const response = await api.get(`/empresas/${empresaId}/tarefa-tipos/simple`);
    return response.data.data; // Extract data from backend response
  }

  async getById(empresaId: number, tipoId: number): Promise<TarefaTipo> {
    const response = await api.get(`/empresas/${empresaId}/tarefa-tipos/${tipoId}`);
    return response.data.data; // Extract data from backend response
  }

  async create(empresaId: number, dto: CreateTarefaTipoDTO): Promise<TarefaTipo> {
    const response = await api.post(`/empresas/${empresaId}/tarefa-tipos`, dto);
    return response.data.data; // Extract data from backend response
  }

  async update(empresaId: number, tipoId: number, dto: UpdateTarefaTipoDTO): Promise<TarefaTipo> {
    const response = await api.put(`/empresas/${empresaId}/tarefa-tipos/${tipoId}`, dto);
    return response.data.data; // Extract data from backend response
  }

  async delete(empresaId: number, tipoId: number): Promise<void> {
    await api.delete(`/empresas/${empresaId}/tarefa-tipos/${tipoId}`);
  }

  async toggleAtivo(empresaId: number, tipoId: number, ativo: boolean): Promise<TarefaTipo> {
    const response = await api.patch(`/empresas/${empresaId}/tarefa-tipos/${tipoId}/toggle-ativo`, { ativo });
    return response.data.data; // Extract data from backend response
  }
}

export default new TarefaTipoService();
