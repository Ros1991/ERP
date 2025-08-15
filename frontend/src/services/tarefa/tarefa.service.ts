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
    const response = await api.get<PaginatedResponse<Tarefa>>(
      `/empresas/${empresaId}/tarefas?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getById(empresaId: number, tarefaId: number): Promise<Tarefa> {
    const response = await api.get<Tarefa>(`/empresas/${empresaId}/tarefas/${tarefaId}`);
    return response.data;
  }

  async create(empresaId: number, dto: CreateTarefaDTO): Promise<Tarefa> {
    const response = await api.post<Tarefa>(`/empresas/${empresaId}/tarefas`, dto);
    return response.data;
  }

  async update(empresaId: number, tarefaId: number, dto: UpdateTarefaDTO): Promise<Tarefa> {
    const response = await api.put<Tarefa>(`/empresas/${empresaId}/tarefas/${tarefaId}`, dto);
    return response.data;
  }

  async delete(empresaId: number, tarefaId: number): Promise<void> {
    await api.delete(`/empresas/${empresaId}/tarefas/${tarefaId}`);
  }

  async updateStatus(
    empresaId: number, 
    tarefaId: number, 
    status: 'PENDENTE' | 'EM_ANDAMENTO' | 'PAUSADA' | 'PARADA' | 'CONCLUIDA' | 'CANCELADA'
  ): Promise<Tarefa> {
    const response = await api.patch<Tarefa>(
      `/empresas/${empresaId}/tarefas/${tarefaId}/status`,
      { status }
    );
    return response.data;
  }
}

export default new TarefaService();
