import api from '../../lib/axios';
import type { 
  TarefaFuncionarioStatus, 
  CreateTarefaFuncionarioStatusDTO, 
  UpdateTarefaFuncionarioStatusDTO 
} from '../../models/tarefa/TarefaFuncionarioStatus.model';

class TarefaFuncionarioStatusService {
  async getAllByTarefa(empresaId: number, tarefaId: number): Promise<TarefaFuncionarioStatus[]> {
    const response = await api.get<TarefaFuncionarioStatus[]>(
      `/empresas/${empresaId}/tarefas/${tarefaId}/funcionario-status`
    );
    return response.data;
  }

  async getAllByFuncionario(empresaId: number, funcionarioId: number): Promise<TarefaFuncionarioStatus[]> {
    const response = await api.get<TarefaFuncionarioStatus[]>(
      `/empresas/${empresaId}/funcionarios/${funcionarioId}/tarefa-status`
    );
    return response.data;
  }

  async getById(empresaId: number, statusId: number): Promise<TarefaFuncionarioStatus> {
    const response = await api.get<TarefaFuncionarioStatus>(
      `/empresas/${empresaId}/tarefa-funcionario-status/${statusId}`
    );
    return response.data;
  }

  async create(empresaId: number, dto: CreateTarefaFuncionarioStatusDTO): Promise<TarefaFuncionarioStatus> {
    const response = await api.post<TarefaFuncionarioStatus>(
      `/empresas/${empresaId}/tarefa-funcionario-status`,
      dto
    );
    return response.data;
  }

  async update(
    empresaId: number, 
    statusId: number, 
    dto: UpdateTarefaFuncionarioStatusDTO
  ): Promise<TarefaFuncionarioStatus> {
    const response = await api.put<TarefaFuncionarioStatus>(
      `/empresas/${empresaId}/tarefa-funcionario-status/${statusId}`,
      dto
    );
    return response.data;
  }

  async delete(empresaId: number, statusId: number): Promise<void> {
    await api.delete(`/empresas/${empresaId}/tarefa-funcionario-status/${statusId}`);
  }

  async updateStatus(
    empresaId: number,
    statusId: number,
    status: 'ATRIBUIDA' | 'EM_ANDAMENTO' | 'PAUSADA' | 'CONCLUIDA' | 'CANCELADA'
  ): Promise<TarefaFuncionarioStatus> {
    const response = await api.patch<TarefaFuncionarioStatus>(
      `/empresas/${empresaId}/tarefa-funcionario-status/${statusId}/status`,
      { status }
    );
    return response.data;
  }
}

export default new TarefaFuncionarioStatusService();
