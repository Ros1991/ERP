import api from '../../lib/axios';
import type { Tarefa, CreateTarefaDTO, UpdateTarefaDTO } from '../../models/tarefa/Tarefa.model';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class TarefaService {
  async getAll(empresaId: number, page = 1, limit = 10): Promise<PaginatedResponse<Tarefa>> {
    const response = await api.get(
      `/empresas/${empresaId}/tarefas`,
      { params: { page, limit } }
    );
    
    // Map backend response structure to frontend expected structure
    const backendData = response.data.data; // Nested data from backend
    return {
      data: backendData.items,
      total: backendData.pagination.total,
      page: backendData.pagination.page,
      limit: backendData.pagination.limit,
      totalPages: Math.ceil(backendData.pagination.total / backendData.pagination.limit)
    };
  }

  async getById(empresaId: number, tarefaId: number): Promise<Tarefa> {
    const response = await api.get(`/empresas/${empresaId}/tarefas/${tarefaId}`);
    return response.data.data; // Extract data from backend response
  }

  async create(empresaId: number, dto: CreateTarefaDTO): Promise<Tarefa> {
    const response = await api.post(`/empresas/${empresaId}/tarefas`, dto);
    return response.data.data; // Extract data from backend response
  }

  async update(empresaId: number, tarefaId: number, dto: UpdateTarefaDTO): Promise<Tarefa> {
    const response = await api.put(`/empresas/${empresaId}/tarefas/${tarefaId}`, dto);
    return response.data.data; // Extract data from backend response
  }

  async delete(empresaId: number, tarefaId: number): Promise<void> {
    await api.delete(`/empresas/${empresaId}/tarefas/${tarefaId}`);
  }

  async updateStatus(
    empresaId: number, 
    tarefaId: number, 
    status: 'PENDENTE' | 'EM_ANDAMENTO' | 'PAUSADA' | 'PARADA' | 'CONCLUIDA' | 'CANCELADA'
  ): Promise<Tarefa> {
    const response = await api.patch(
      `/empresas/${empresaId}/tarefas/${tarefaId}/status`,
      { status }
    );
    return response.data.data; // Extract data from backend response
  }
}

export default new TarefaService();
