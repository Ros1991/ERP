import api from '../../lib/axios'; // config/api';
import type { TarefaTipo, CreateTarefaTipoDTO, UpdateTarefaTipoDTO } from '../../models/tarefa/TarefaTipo.model';

class TarefaTipoService {
  async getAll(empresaId: number): Promise<TarefaTipo[]> {
    const response = await api.get<TarefaTipo[]>(`/empresas/${empresaId}/tarefa-tipos`);
    return response.data;
  }

  async getById(empresaId: number, tipoId: number): Promise<TarefaTipo> {
    const response = await api.get<TarefaTipo>(`/empresas/${empresaId}/tarefa-tipos/${tipoId}`);
    return response.data;
  }

  async create(empresaId: number, dto: CreateTarefaTipoDTO): Promise<TarefaTipo> {
    const response = await api.post<TarefaTipo>(`/empresas/${empresaId}/tarefa-tipos`, dto);
    return response.data;
  }

  async update(empresaId: number, tipoId: number, dto: UpdateTarefaTipoDTO): Promise<TarefaTipo> {
    const response = await api.put<TarefaTipo>(`/empresas/${empresaId}/tarefa-tipos/${tipoId}`, dto);
    return response.data;
  }

  async delete(empresaId: number, tipoId: number): Promise<void> {
    await api.delete(`/empresas/${empresaId}/tarefa-tipos/${tipoId}`);
  }

  async toggleAtivo(empresaId: number, tipoId: number, ativo: boolean): Promise<TarefaTipo> {
    const response = await api.patch<TarefaTipo>(`/empresas/${empresaId}/tarefa-tipos/${tipoId}/toggle-ativo`, { ativo });
    return response.data;
  }
}

export default new TarefaTipoService();
